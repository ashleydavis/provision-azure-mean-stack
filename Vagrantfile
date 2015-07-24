# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

    config.vm.box = "ubuntu/trusty64"

    # Create a forwarded port mapping which allows access to a specific port
    # within the machine from a port on the host machine. In the example below,
    # accessing "localhost:8080" will access port 80 on the guest machine.
    # config.vm.network "forwarded_port", guest: 80, host: 8080

    # Share an additional folder to the guest VM. The first argument is
    # the path on the host to the actual folder. The second argument is
    # the path on the guest to mount the folder. And the optional third
    # argument is a set of non-required options.
    # config.vm.synced_folder "../data", "/vagrant_data"

    config.vm.define :sometestvm1 do |vm|
        vm.vm.provision :shell, path: "provision.sh", privileged: false
        vm.vm.host_name = "sometestvm1"
        vm.vm.network "private_network", ip: "10.0.0.2"
    end

    config.vm.define :sometestvm2 do |vm|
        vm.vm.provision :shell, path: "provision.sh", privileged: false
        vm.vm.host_name = "sometestvm2"
        vm.vm.network "private_network", ip: "10.0.0.3"
    end
end

