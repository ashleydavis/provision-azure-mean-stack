'use strict';

var argv = require('yargs').argv;
var config = require('./config');
var azure = require('azure-api');
var Q = require('q');
var E = require('linq');
var assert = require('chai').assert;

//
// Generate the full name for a VM.
//
var genFullVmName = function (vm, vmBaseName) {

	assert.isObject(vm);
	assert.isString(vmBaseName);

	if (vm.fullName) {
		return vm.fullName;
	}

	if (vmBaseName) {
		return vmBaseName + vm.name;
	}

	if (vm.name) {
		return vm.name;
	}

	throw new Error("VM has no name!");
}

//
// Provision a collection of VMs.
//
var provisionVms = function (vms, networkName, vmBaseName) {

	assert.isArray(vms);
	assert.isString(networkName);
	assert.isString(vmBaseName);

	var provisionVmPromises = E.from(vms)
		.select(function (vm) {
			var fullVmName = genFullVmName(vm, vmBaseName);
			return azure.provisionVM(fullVmName, networkName, vm.imageName, vm.user, vm.pass, vm.ip, vm.endpoints, vm.provisionScript, vm);
		})
		.toArray()

	return Q.all(provisionVmPromises);
};

//
// Provision an entire network and VMs.
//
var provisionNetwork = function (network) {

	assert.isObject(network);

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
	assert.isArray(networks);

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
