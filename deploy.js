'use strict';

var argv = require('yargs').argv;
var config = require('./config');
var azure = require('./azure-api');
var Q = require('q');
var E = require('linq');

//
// Create and provision a specific VM.
//
var provisionVM = function (vm, networkName) {
	return azure.createVM(vm.name, networkName, vm.imageName, vm.user, vm.pass, vm.endpoints)
		.then(function () {
			return azure.waitVmRunning(vm.name);
		})
		.then(function () {
			var host = vm.name + '.cloudapp.net';
			return azure.runSshScript(host, vm.user, vm.pass, vm.provisionScript);
		});
};

//
// Provision a collection of VMs.
//
var provisionVms = function (vms, networkName) {
	var provisionVmPromises = E.from(vms)
		.select(function (vm) {
			return provisionVM(vm, networkName);
		})
		.toArray()

	return Q.all(provisionVmPromises);
};

//
// Provision an entire network and VMs.
//
var provisionNetwork = function (network) {
	return azure.createNetwork(network.name, network.location)
		.then(function () {
			return provisionVms(network.vms, network.name);
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
