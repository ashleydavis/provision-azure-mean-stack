'use strict';

var argv = require('yargs').argv;
var config = require('./config');
var azure = require('azure-api');
var Q = require('q');
var E = require('linq');
var util = require('util');

//
// Run a single or set of provisioning scripts on the VM.
//
var runProvisioningScripts = function (vm, fullVmName) {
	if (vm.provisionScript) {
		var host = fullVmName + '.cloudapp.net';
		if (utils.isArray(vm.provisionScript)) {
			return Q.all(E.from(vm.provisionScript)
				.select(function (script) {
					return azure.runSshScript(host, vm.user, vm.pass, script)
				})
				.toArray()
			);
		}
		else {
			return azure.runSshScript(host, vm.user, vm.pass, vm.provisionScript);
		}
	}
	else {
		return Q();
	}
};

//
// Create and provision a specific VM.
//
var provisionVM = function (vm, networkName, vmBaseName) {

	var fullVmName = vmBaseName && (vmBaseName + vm.name) || vm.name;
	console.log('Creating VM: ' + fullVmName);

	return azure.createVM(fullVmName, networkName, vm.imageName, vm.user, vm.pass, vm.ip, vm.endpoints)
		.then(function () {
			return azure.waitVmRunning(fullVmName);
		})
		.then(function () {
			return runProvisioningScripts(vm, fullVmName);
		});
};

//
// Provision a collection of VMs.
//
var provisionVms = function (vms, networkName, vmBaseName) {
	var provisionVmPromises = E.from(vms)
		.select(function (vm) {
			return provisionVM(vm, networkName, vmBaseName);
		})
		.toArray()

	return Q.all(provisionVmPromises);
};

//
// Provision an entire network and VMs.
//
var provisionNetwork = function (network) {
	console.log('Creating network ' + network.name + ' in location ' + network.location);

	return azure.createNetwork(network.name, network.location)
		.then(function () {
			return provisionVms(network.vms, network.name, network.vmBaseName);
		});
};

//
// Provision a collection of networks.
//
var provisionNetworks = function (networks) {
	return E.from(networks)
		.select(function (network) {
			return provisionNetwork(network);
		})
		.toArray();
};

Q.all(provisionNetworks(config.networks))	
	.then(function () {
		console.log('Provisioning complete');
	})
	.catch(function (err) {
		console.error('An error occurred during provisioning:');
		console.error(err.stack);
	});
