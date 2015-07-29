//
// This is example configuration.
// Please update for your own needs.
//

//
// This is Javascript! Feel free to run code here to generate your configuration.
//

module.exports = {
	networks: [
		{
			name: 'mytestnetwork800',
			vmBaseName: 'mytestnetwork800-',
			location: 'Australia East',	
			vms: [
				{
					name: 'sometestvm1',
					imageName: 'b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu_DAILY_BUILD-trusty-14_04_2-LTS-amd64-server-20150708-en-us-30GB',
					user: 'Test1234',
					pass: 'Test1234!',
					ip: "10.0.0.4",
					endpoints: [
						{
							name: 'HTTP',
							externalPort: 80,
							internalPort: 3000,						
						},
					],
					provisionScript: [
						'provision.sh',
						'provision.sh',
					],
				},
				{
					fullName: 'sometestvm2',
					imageName: 'b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu_DAILY_BUILD-trusty-14_04_2-LTS-amd64-server-20150708-en-us-30GB',
					user: 'Test1234',
					pass: 'Test1234!',
					ip: "10.0.0.5",
					endpoints: [
						{
							name: 'HTTP',
							externalPort: 80,
							internalPort: 3000,						
						},
					],
					provisionScript: 'provision.sh',
				},
				{
					fullName: 'FullyQualifiedVMName',
					imageName: 'b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu_DAILY_BUILD-trusty-14_04_2-LTS-amd64-server-20150708-en-us-30GB',
					user: 'Test1234',
					pass: 'Test1234!',
					endpoints: [
						{
							name: 'HTTP',
							externalPort: 80,
							internalPort: 3000,						
						},
					],
				},
			],
		},
	],
};