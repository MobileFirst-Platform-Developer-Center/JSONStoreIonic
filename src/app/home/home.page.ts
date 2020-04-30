import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
   //****************************************************
  // JSONStore collection(s) setup
  //****************************************************
  collectionName = 'people';
  collections = {};
  options = {};
  query = {};
 

  ngAfterViewInit() {
    this.collections[this.collectionName] = {};
    this.collections[this.collectionName].searchFields = {name: 'string', age: 'integer'};
    // Get the selected API from the HTML select element and use the this.displayDiv() function to display the appropriate HTML div
    // var obj = document.getElementById("api_select");
    // obj.addEventListener("change", function() {
    //     // Add Document
    //     if(obj.selectedIndex == 1){
    //         this.showHideConsole("hide");
    //         this.displayDiv("AddDataDiv");
    //     }
    //     // Find Document
    //     else if(obj.selectedIndex == 2) {
    //         this.showHideConsole("show");
    //         this.displayDiv("FindDocDiv");
    //     }
    //     // Replace Document
    //     else if(obj.selectedIndex == 3) {
    //         this.showHideConsole("hide");
    //         this.displayDiv("ReplaceDocDiv");
    //     }
    //     // Remove Document
    //     else if(obj.selectedIndex == 4) {
    //         this.showHideConsole("show");
    //         this.displayDiv("RemoveDocDiv");
    //     }
    //     // Count Documents
    //     else if(obj.selectedIndex == 5) {
    //         this.showHideConsole("show");
    //         countDocs();
    //     }
    //     // Adapter Integration
    //     else if(obj.selectedIndex == 6) {
    //         this.showHideConsole("show");
    //         this.displayDiv("AdapterIntegrationDiv");
    //     }
    //     // File Info
    //     else if(obj.selectedIndex == 7) {
    //         this.showHideConsole("show");
    //         getFileInfo();
    //     }
    //     // Change Password
    //     else if(obj.selectedIndex == 8) {
    //         this.displayDiv("ChangePasswordDiv");
    //     }
    // });
  }


//*********************************************************************
// buildSelectOptions
// - This function builds the options of the API-select-object
//   of the API-select-object after initialization of the collection
//*********************************************************************
buildSelectOptions(obj) {
  //obj.options[1] = new Option("addData", "Add Data", true, false);
  obj.options[1] = new Option("Add Data");
  obj.options[2] = new Option("Find Document");
  obj.options[3] = new Option("Replace Document");
  obj.options[4] = new Option("Remove Document");
  obj.options[5] = new Option("Count Documents");
  obj.options[6] = new Option("Adapter Integration");
  obj.options[7] = new Option("File Info");
  if(this.options["username"] != undefined && this.options["password"] != undefined){
      obj.options[8] = new Option("Change Password");
  }

}

//*********************************************************************
// displayDiv
// - This function shows / hides the divs for the apis that require
//   additional data. For example: add data requires new name & age
//   for the new document to add.
//*********************************************************************
displayDiv(divName){
  var divNames = ["AddDataDiv", "FindDocDiv", "ReplaceDocDiv", "RemoveDocDiv", "AdapterIntegrationDiv", "ChangePasswordDiv"];
  for(var i=0; i<divNames.length; i++){
      document.getElementById(divNames[i]).style.display = "none";
  }
  document.getElementById(divName).style.display = "block";
}

//****************************************************
// showHideConsole
// - this function hides / displays the console div
//   and adjust the container div height accordingly
//****************************************************
showHideConsole(displayStatus){
  if(displayStatus == "show"){
     document.getElementById("container").style.height = "80%";
     document.getElementById("console").style.height = "20%";
     document.getElementById("console").style.display = "block";
  }
  else{
     document.getElementById("container").style.height = "100%";
     document.getElementById("console").style.display = "none";
  }
}

//****************************************************
// initCollection
//****************************************************
initCollection(isSecured){
  if(isSecured == "secured"){
    this.options["username"] = document.getElementById("initUsername")["value"];
    this.options["password"] = document.getElementById("initPassword")["value"];
  }

WL.JSONStore.init(this.collections, this.options).then(function () {
      // build the <select> options + hide the init screen + display the second screen
      this.buildSelectOptions(document.getElementById("api_select"));
      document.getElementById("initCollection_screen").style.display = "none";
      document.getElementById("apiCommands_screen").style.display = "block";

      if(isSecured == "secured") {
          this.showHideConsole("show");
          document.getElementById("resultsDiv").innerHTML = "Secured Collection Initialized Successfuly<br>User Name: "+ this.options.username +" | Password: "+ this.options.password;
          // Clear the username & password fields
          document.getElementById("initUsername")["value"] = "";
          document.getElementById("initPassword")["value"] = "";
      }
      else {
          document.getElementById("resultsDiv").innerHTML = "Collection Initialized Successfuly";
      }
  })
  .fail(function (errorObject) {
      alert("Filed to initialize collection\n"+ JSON.stringify(errorObject));
});
}

//****************************************************
// closeCollection
// - Log out from the current collection
//****************************************************
closeCollection(){
  WL.JSONStore.closeAll({}).then(function () {
      this.showHideConsole("show");
      document.getElementById("apiCommands_screen").style.display = "none";
      document.getElementById("initCollection_screen").style.display = "block";
      document.getElementById("resultsDiv").innerHTML = "Collection Closed Successfuly";
}).fail(function (errorObject) {
  alert("Failed to Close collection!");
});
}

//****************************************************
// removeCollection
// - Deletes all the collection's documents
//****************************************************
removeCollection(){
  WL.JSONStore.get(this.collectionName).removeCollection({}).then(function () {
      this.showHideConsole("show");
      document.getElementById("apiCommands_screen").style.display = "none";
      document.getElementById("initCollection_screen").style.display = "block";
      document.getElementById("resultsDiv").innerHTML = "Collection Removed Successfuly";
}).fail(function (errorObject) {
  alert("Failed to Remove collection!");
});
}

//****************************************************
// destroy
// - Completely wipes data for all users
//****************************************************
destroy(){
  WL.JSONStore.destroy({}).then(function () {
      this.showHideConsole("show");
      document.getElementById("apiCommands_screen").style.display = "none";
      document.getElementById("initCollection_screen").style.display = "block";
      document.getElementById("resultsDiv").innerHTML = "Collection Destroyed Successfuly";
}).fail(function (errorObject) {
  alert("Failed to Destroy collection!");
});
}

//****************************************************
// addData (Add Document)
//****************************************************
addData(){
  var data = {};
  var options = {};
  data["name"] = document.getElementById("addName")["value"];
  data["age"] = document.getElementById("addAge")["value"];

  try {
      WL.JSONStore.get(this.collectionName).add(data, options).then(function () {
          this.showHideConsole("show");
          document.getElementById("resultsDiv").innerHTML = "New Document Added Successfuly<br>Name: "+data["name"]+" | Age: "+data["age"];
  }).fail(function (errorObject) {
          this.showHideConsole("show");
          document.getElementById("resultsDiv").innerHTML = "Failed to Add Data";
  });
  }
  catch(e){
      alert("WL.JSONStore Add Data Failure");
  }
  document.getElementById("addName")["value"] = "";
  document.getElementById("addAge")["value"] = "";
}

//****************************************************
// findById
//****************************************************
findById(){
  this.showHideConsole("show");
  var object = [];
  var id = parseInt(document.getElementById("findWhat")["value"], 10) || '';
  object.push(id);

  try {
      WL.JSONStore.get(this.collectionName).findById(object, {}).then(function (res) {
          document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
  }).fail(function (errorObject) {
          document.getElementById("resultsDiv").innerHTML = errorObject.msg;
  });
} catch (e) {
  alert(e.Messages);
}
  document.getElementById("findWhat")["value"] = "";
}

//****************************************************
// findByName
//****************************************************
findByName(){
  this.showHideConsole("show");
  var name = document.getElementById("findWhat")["value"] || '';
  var query = {};
  query[name] = name;
  if(name != ""){
      try {
          WL.JSONStore.get(this.collectionName).find(query, this.options).then(function (res) {
          document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
      }).fail(function (errorObject) {
          document.getElementById("resultsDiv").innerHTML = errorObject.msg;
      });
      } catch (e) {
          alert(e.Messages);
      }
  }
  else {
      alert("Please enter a name to find");
  }
  document.getElementById("findWhat")["value"] = "";
}

//****************************************************
// findByAge
//****************************************************
findByAge(){
  this.showHideConsole("show");
  var age = document.getElementById("findWhat")["value"] || '';

  if(age == "" || isNaN(age)){
      alert("Please enter a valid age to find");
  }
  else {
      this.query = {age: parseInt(age, 10)};
      var options = {
          exact: true,
          limit: 10 //returns a maximum of 10 documents
      };

      try {
          WL.JSONStore.get(this.collectionName).find(this.query, options).then(function (res) {
          document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
      }).fail(function (errorObject) {
          document.getElementById("resultsDiv").innerHTML = errorObject.msg;
      });
      } catch (e) {
          alert(e.Messages);
      }
  }
  document.getElementById("findWhat")["value"] = "";
}

//****************************************************
// findAll
//****************************************************
findAll(){
  this.showHideConsole("show");
  this.options["limit"] = 10;

  try {
      WL.JSONStore.get(this.collectionName).findAll(this.options).then(function (res) {
          document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
  }).fail(function (errorObject) {
          document.getElementById("resultsDiv").innerHTML = errorObject.msg;
  });
} catch (e) {
  alert(e.Messages);
}
  document.getElementById("findWhat")["value"] = "";
}

//****************************************************
// replaceShowDoc
//****************************************************
replaceShowDoc(){
 var obj = [];
 var id = parseInt(document.getElementById("replaceDocId")["value"], 10);
 obj.push(id);
 this.showHideConsole("hide");
 try {
      WL.JSONStore.get(this.collectionName).findById(obj,{}).then(function (res) {
          document.getElementById("replaceName")["value"] = res[0].json.name;
          document.getElementById("replaceAge")["value"] = res[0].json.age;
      }).fail(function (errorObject) {
          alert(errorObject.msg);
      });
  } catch (e) {
      alert(e.Messages);
  }
}

//****************************************************
// clearAndHideReplaceDiv
//****************************************************
clearAndHideReplaceDiv(){
  document.getElementById("replaceDocId")["value"] = "";
  document.getElementById("replaceName")["value"] = "";
  document.getElementById("replaceAge")["value"] = "";
  document.getElementById("ReplaceDocDiv").style.display = "none";
}

//****************************************************
// replaceDoc
//****************************************************
replaceDoc(){
  var doc_id = parseInt(document.getElementById("replaceDocId")["value"], 10);
  var doc_name = document.getElementById("replaceName")["value"];
  var doc_age = document.getElementById("replaceAge")["value"];
  var doc = {_id: doc_id, json: {name: doc_name, age: doc_age}};

  var options = {
      push: true
  }

  WL.JSONStore.get(this.collectionName).replace(doc, options).then((numberOfDocumentsReplaced) => {
      this.showHideConsole("show");
      document.getElementById("resultsDiv").innerHTML = "Document updated successfuly";
      this.clearAndHideReplaceDiv();
  })
  .fail(function (errorObject) {
      document.getElementById("resultsDiv").innerHTML = "Failed to update document: " + errorObject.msg
      this.clearAndHideReplaceDiv();
  });
}

//****************************************************
// removeDoc
//****************************************************
removeDoc(){
  this.showHideConsole("show");
  var id = parseInt(document.getElementById("docId")["value"], 10);
  var query = {_id: id};
  var options = {exact: true};
  try {
    WL.JSONStore.get(this.collectionName).remove(query, options).then(function (res) {
          document.getElementById("resultsDiv").innerHTML = "Documents removed: " + JSON.stringify(res)
  }).fail(function (errorObject) {
          document.getElementById("resultsDiv").innerHTML = errorObject.msg
  });
  } catch (e) {
  alert(e.Messages);
}
  document.getElementById("docId")["value"] = "";
}

//****************************************************
// countDocs
//****************************************************
countDocs(){
  try {
    WL.JSONStore.get(this.collectionName).count({},{}).then(function (res) {
          document.getElementById("resultsDiv").innerHTML = "Number of documents in the collection: " + res;
  }).fail(function (errorObject) {
          document.getElementById("resultsDiv").innerHTML = errorObject.msg;
  });
} catch (e) {
  alert(e.Messages);
}
}

//****************************************************
// loadFromAdapter
//****************************************************
loadFromAdapter(){
  try {

      var resource = new WLResourceRequest("adapters/JSONStoreAdapter/getPeople", WLResourceRequest.GET);

      resource.send()

      .then(function (responseFromAdapter) {
        // Handle invokeProcedure success.

        var data = responseFromAdapter.responseJSON.peopleList;

        // Example:
        // data = [{id: 1, ssn: '111-22-3333', name: 'carlos'}];

        var changeOptions = {

          // The following example assumes that 'id' and 'ssn' are search fields,
          // default will use all search fields
          // and are part of the data that is received.
          replaceCriteria : ['id', 'ssn'],

          // Data that does not exist in the Collection will be added, default false.
          addNew : true,

          // Mark data as dirty (true = yes, false = no), default false.
          markDirty : false
        };

        return WL.JSONStore.get(this.collectionName).change(data, changeOptions);
      })

      .then(function (res) {

         // Handle change success.
        document.getElementById("resultsDiv").innerHTML = JSON.stringify(res) + " Documents Loaded From Adapter" ;
      })

      .fail(function (errorObject) {
        // Handle failure.
        document.getElementById("resultsDiv").innerHTML = errorObject.msg;
      });


  } catch (e) {
          alert("Failed to load data from adapter " + e.Messages);
  }

}

//****************************************************
// getDirtyDocs
//****************************************************
getDirtyDocs(){
  try {
      WL.JSONStore.get(this.collectionName).getAllDirty({}).then(function (res) {
          document.getElementById("resultsDiv").innerHTML = "Dirty Documents:<br>" + JSON.stringify(res);
      }).fail(function (errorObject) {
          alert("Failed to get dirty documents:\n"+ errorObject.msg);
      });
  } catch (e) {
      alert("Failed to get dirty documents");
  }
}

//****************************************************
// pushToAdapter
//****************************************************
pushToAdapter(){
  alert("pushToAdapter");
  try {

      var dirtyDocs;

      WL.JSONStore.get(this.collectionName)

      .getAllDirty({})

      .then(function (arrayOfDirtyDocuments) {
        // Handle getAllDirty success.

        dirtyDocs = arrayOfDirtyDocuments;

        var resource = new WLResourceRequest("adapters/JSONStoreAdapter/pushPeople", WLResourceRequest.POST);
        resource.setQueryParameter('params', dirtyDocs);
        resource.addHeader("Content-Type","application/x-www-form-urlencoded");
        return resource.send();
      })

      .then(function (responseFromAdapter) {
        // Handle invokeProcedure success.

        // You may want to check the response from the adapter
        // and decide whether or not to mark documents as clean.
        return WL.JSONStore.get(this.collectionName).markClean(dirtyDocs, {});
      })

      .then(function (res) {
        // Handle markClean success.
        document.getElementById("resultsDiv").innerHTML = JSON.stringify(res) + "Documents Pushed Successfully";

      })

      .fail(function (errorObject) {
        // Handle failure.
        alert(errorObject.msg);
      });



  } catch (e) {
      alert("Failed To Push Documents to Adapter");
  }
}

//****************************************************
// changePassword
//****************************************************
changePassword(){
  this.showHideConsole("show");
  var newPassword = document.getElementById("newPassword")["value"];
  if(newPassword == ""){
      alert("Please enter new password");
  }
  else{
      WL.JSONStore.changePassword(this.options["password"], newPassword, this.options["username"], {}).then(function () {
          document.getElementById("resultsDiv").innerHTML = "Password changed successfuly"
      }).fail(function (errorObject) {
          document.getElementById("resultsDiv").innerHTML = "Failed to change password:\n" + errorObject.msg
      });
  }
}

//****************************************************
// getFileInfo
//****************************************************
getFileInfo(){
  try {
      WL.JSONStore.fileInfo()
      .then(function (res) {
          document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
      })
      .fail(function () {
          alert("Failed To Get File Information");
      });
  } catch (e) {
      alert("Failed To Get File Information");
  }
}
}


