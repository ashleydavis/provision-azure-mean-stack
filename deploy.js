'use strict';

var argv = require('yargs').argv;
var config = require('./config');
var azure = require('azure-api');
var Q = require('q');
var E = require('linq');
var util = require('util');
var Mustache = require('Mustache');
var SshClient = require('ssh-promise');
var fs = require('fs');

//
// Run a templated shell script on a particular Azure VM via ssh.
//
var runSshScript = function (host, user, pass, scriptFilePath, templateView) {
	var sshConfig = {
		host: host,
		username: user,
		password: pass,
	};

	console.log('Running provisioning script ' + scriptFilePath + ' on VM ' + host);

	var scriptTemplate = fs.readFileSync(scriptFilePath).toString();
	console.log('template: ' + scriptTemplate);
	var scriptInstance = Mustache.render(scriptTemplate, templateView);
	console.log('instance: ' + scriptInstance);

	var ssh = new SshClient(sshConfig);
	return ssh.exec(scriptInstance);
};

//
// Generate a URL for the VM.
//
var genHostName = function (vmName) {
	return fullVmName + '.cloudapp.net';
};

//
// Run a single or set of provisioning scripts on the VM.
//
var runProvisioningScripts = function (vm, fullVmName) {
	if (vm.provisionScript) {
		var host = genHostName(fullVmName);
		if (util.isArray(vm.provisionScript)) {
			return Q.all(E.from(vm.provisionScript)
				.select(function (script) {
					return runSshScript(host, vm.user, vm.pass, script, vm)
				})
				.toArray()
			);
		}
		else {
			return runSshScript(host, vm.user, vm.pass, vm.provisionScript, vm);
		}
	}
	else {
		return Q();
	}
};

//
// Generate the full name for a VM.
//
var genFullVmName = function (vm, vmBaseName) {
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
// Create and provision a specific VM.
//
var provisionVM = function (vm, networkName, vmBaseName) {


	var fullVmName = genFullVmName(vm, vmBaseName);
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
