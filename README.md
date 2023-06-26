This is a Vue 3 client written to be used as the frontend for the Analytical Methods and Open Spectra (AMOS) application.  The Flask backend used alongside it can be found [here](https://github.com/USEPA/AMOS-Server).

The primary packages used are Vue itself, Axios, and AG Grid for core functionality, plus Bootstrap for some of the visual elements.


### Running the client
The client can be run using "npm run dev" from the command line in the top-level directory.  Two environment files are provided:
- **.env** contains the base path of the Flask backend when both are running on localhost. This file is used by default by the client.
- **.env.deployed** contains the base path of the Flask backend when the backend is on the 819 server.  To use this, append "-- --mode=deployed" (note the extra pair of dashes) to the terminal command. 
