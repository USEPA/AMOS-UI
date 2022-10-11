This is a Vue 3 client written to be used as the user side of the spectrum search app.  The Flask backend used alongside it can be found [here](https://ccte-bitbucket.epa.gov/users/gjanesch/repos/spectrum-search-app-server/browse).

The primary packages used are Vue itself, Axios, and AG Grid.


### Running the client
The client can be run using "npm run dev" from the command line in the top-level directory.  Two environment files are provided:
- **.env** contains the base path of the Flask backend when both are running on localhost.  This file is used by default by the client.
- **.env.deployed** contains the base path of the Flask backend when the backend is on the 819 server.  To use this