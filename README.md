# provision-azure-mean-stack

A template script for provisioning Azure networks and VMs with [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)) installed.

You must have [azure-cli](https://www.npmjs.com/package/azure-cli) [installed](https://www.npmjs.com/package/azure-cli#installation) and [authenticated](https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-connect/) to use this.

If you are looking for an Azure API, please see [this repo](https://github.com/codecapers/azure-api).

Clone the repo locally:

	git clone https://github.com/codecapers/deploy-azure-mean-stack.git

CD into the repo directory:

	cd deploy-azure-mean-stack

Now have a look at *config.js*. This defines the networks and VMs that will be created and provisioned by this script. A test configuration is setup that you can run straight away to see if this script does what you want. 

**WARNING** This will actually create networks and VMs in your Azure subscription. You will have to go back and delete these later.

In production you will need to tailor *config.js* to the needs of your project. 

**WARNING** You should at least change the names, user names and passwords of your VMs before running the test script.

To deploy the Azure resources defined in *config.js*:

	node deploy.js

Then wait for the script to complete (this can take some time).

 The project also contains an example Vagrant file that can boot a similar local VM network.