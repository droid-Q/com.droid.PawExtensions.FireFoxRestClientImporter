(function() {
    // Extensions are implemented as JavaScript classes
    var FireFoxRestClientImporter = function() {

        this.importString = function(context, string) {
            var error, error1, inputTree;
            try {
                inputTree = JSON.parse(string);
            } catch (error1) {
                error = error1;
                throw new Error("Invalid RestClient file (not a valid JSON)");
            }
            if (!inputTree) {
                throw new Error("Invalid RestClient file (missing root data)");
            }
            this.importAllRequests(context, inputTree);
            return true;
        };
        // implement the importString(context, stringToImport) method to generate code
        this.importRequest = function(context, stringToImport) {

            var requestName = stringToImport["name"];
            var requestMethod = stringToImport["method"];
            var requestURL = stringToImport["url"];
            console.log(requestName);
            // Create the request with name, HTTP method, and URL
            var request = context.createRequest(requestName, requestMethod, requestURL);
            // Set the body as raw text
            request.body = stringToImport.body;
            // Success
            return request;
        };
        this.importAllRequests = function(context, inputTree) {
            var keyArray = [],
                projectArray = [],
                i, len, pawGroup, results;
            if (!inputTree) {
                throw new Error("Input RestClient file doesn't have any request to import");
            }
            for (var key in inputTree) {
                keyArray.push(key);
            }
            projectArray = this.buildProjectMap(keyArray, inputTree);
            console.log(projectArray.length);
            pawGroup = context.createRequestGroup("eaglewise");
            results = [];
            for (i = 0, len = keyArray.length; i < len; i++) {
                pawRequest = this.importRequest(context, projectArray[i]);
                pawGroup.appendChild(pawRequest);
            }
            results.push(pawGroup);
            return results;
        };
        this.buildProjectMap = function(keyArray, inputTree) {
            var i, len, projectArray = [];
            for (i = 0, len = keyArray.length; i < len; i++) {
                var request = {};
                var inputRequest = inputTree[keyArray[i]];
                request["name"] = keyArray[i];
                request["method"] = inputRequest.method;
                request["url"] = inputRequest.url;
                request["body"] = inputRequest.body;
                request["headers"] = inputRequest.headers;
                projectArray.push(request);
            }
            return projectArray;
        };
    };

    // set the Extension Identifier (must be same as the directory name)
    FireFoxRestClientImporter.identifier = "com.droid.PawExtensions.FireFoxRestClientImporter";
    // give a display name to your Importer
    FireFoxRestClientImporter.title = "FireFox RestClient Importer";
    registerImporter(FireFoxRestClientImporter);
}).call(this);