import { Component, NgZone } from '@angular/core';
import { throws } from 'assert';

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


  // View Components
  initCollection_screen = false;
  apiCommands_screen = true;
  AddDataDiv = true;
  FindDocDiv = true;
  ReplaceDocDiv = true;
  AdapterIntegrationDiv = true;
  ChangePasswordDiv = true;
  RemoveDocDiv = true;

  // Display Components
  resultsDiv = "";
  menuOptions = ["Add Data", "Find Document", "Replace Document", "Count Documents","Adapter Integration","File Info"];

  // Input Data
  initUsername;
  initPassword;
  addName;
  addAge;
  findWhat;
  replaceDocId;
  replaceName;
  replaceAge;
  docId;
  newPassword;


  constructor(private zone: NgZone) {
    this.collections[this.collectionName] = {};
    this.collections[this.collectionName].searchFields = {name: 'string', age: 'integer'};
  }


//*********************************************************************
// buildSelectOptions
// - This function builds the options of the API-select-object
//   of the API-select-object after initialization of the collection
//*********************************************************************
buildSelectOptions() {
  this.menuOptions = ["Add Data", "Find Document", "Replace Document", "Count Documents","Adapter Integration","File Info"];
  if(this.options["username"] != undefined && this.options["password"] != undefined){
    this.menuOptions.push("Change Password");
  }
}

//*********************************************************************
// displayDiv
// - This function shows / hides the divs for the apis that require
//   additional data. For example: add data requires new name & age
//   for the new document to add.
//*********************************************************************
displayDiv(option){
  
  this.AddDataDiv = true;
  this.FindDocDiv = true;
  this.ReplaceDocDiv = true;
  this.AdapterIntegrationDiv = true;
  this.ChangePasswordDiv = true;
  this.RemoveDocDiv = true;

  switch (option.detail.value) {
    case this.menuOptions[0]:
      this.AddDataDiv = false;
      break;
    case this.menuOptions[1]:
      this.FindDocDiv = false;
      break;
    case this.menuOptions[2]:
      this.ReplaceDocDiv = false;
      break;
    case this.menuOptions[3]:
      this.countDocs();
      break;
    case this.menuOptions[4]:
      this.AdapterIntegrationDiv = false;
      break;
    case this.menuOptions[5]:
      this.getFileInfo();
      break;
    case this.menuOptions[6]:
      this.ChangePasswordDiv = false;
      break;
    default:
      break;
  }
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
  if(isSecured){
    this.options["username"] = this.initUsername;
    this.options["password"] = this.initPassword;
  }

WL.JSONStore.init(this.collections, this.options).then(() => {
  // build the <select> options + hide the init screen + display the second screen
      this.showHideConsole("show");
      this.buildSelectOptions();
      this.initCollection_screen = true;
      this.apiCommands_screen = false;

      if(isSecured == "secured") {
          this.resultsDiv = "Secured Collection Initialized Successfuly\nUser Name: "+ this.options["username"] +" | Password: "+ this.options["password"];
          // Clear the username & password fields
          this.initUsername = "";
          this.initPassword = "";
      }
      else {
          this.resultsDiv = "Collection Initialized Successfuly";
      } 
  })
  .fail((errorObject) => {
      alert("Filed to initialize collection\n"+ JSON.stringify(errorObject));
});
}
//****************************************************
// closeCollection
// - Log out from the current collection
//****************************************************
closeCollection(){
  WL.JSONStore.closeAll({}).then(() => {
      this.showHideConsole("show");
      this.apiCommands_screen = true;
      this.initCollection_screen = false;
      this.resultsDiv = "Collection Closed Successfuly";
}).fail((errorObject) => {
  alert("Failed to Close collection!");
});
}

//****************************************************
// removeCollection
// - Deletes all the collection's documents
//****************************************************
removeCollection(){
  WL.JSONStore.get(this.collectionName).removeCollection({}).then(() => {
      this.showHideConsole("show");
      this.apiCommands_screen = true;
      this.initCollection_screen = false;
      this.resultsDiv = "Collection Removed Successfuly";
}).fail((errorObject) => {
  alert("Failed to Remove collection!");
});
}

//****************************************************
// destroy
// - Completely wipes data for all users
//****************************************************
destroy(){
  WL.JSONStore.destroy({}).then(() => {
      this.showHideConsole("show");
      this.apiCommands_screen = true;
      this.initCollection_screen = false;
      this.resultsDiv = "Collection Destroyed Successfuly";
}).fail((errorObject) => {
  alert("Failed to Destroy collection!");
});
}

//****************************************************
// addData (Add Document)
//****************************************************
addData(){
  var data = {};
  var options = {};
  data["name"] = this.addName;
  data["age"] = this.addAge;

  try {
      WL.JSONStore.get(this.collectionName).add(data, options).then(() => {
          this.showHideConsole("show");
          this.resultsDiv = "New Document Added Successfuly\nName: "+data["name"]+" | Age: "+data["age"];
  }).fail((errorObject) => {
          this.showHideConsole("show");
          this.resultsDiv = "Failed to Add Data";
  });
  }
  catch(e){
      alert("WL.JSONStore Add Data Failure");
  }
  this.addName = "";
  this.addAge = "";
}

//****************************************************
// findById
//****************************************************
findById(){
  this.showHideConsole("show");
  var object = [];
  var id = parseInt(this.findWhat, 10) || '';
  object.push(id);

  try {
      WL.JSONStore.get(this.collectionName).findById(object, {}).then((res) => {
          this.resultsDiv = JSON.stringify(res);
  }).fail((errorObject) => {
          this.resultsDiv = errorObject.msg;
  });
} catch (e) {
  alert(e.Messages);
}
  this.findWhat = "";
}

//****************************************************
// findByName
//****************************************************
findByName(){
  this.showHideConsole("show");
  var name = this.findWhat || '';
  this.query =  {name: name};
  if(name != ""){
      try {
          WL.JSONStore.get(this.collectionName).find(this.query, this.options).then((res) => {
          this.resultsDiv = JSON.stringify(res);
      }).fail((errorObject) => {
          this.resultsDiv = errorObject.msg;
      });
      } catch (e) {
          alert(e.Messages);
      }
  }
  else {
      alert("Please enter a name to find");
  }
  this.findWhat = "";
}

//****************************************************
// findByAge
//****************************************************
findByAge(){
  this.showHideConsole("show");
  var age = this.findWhat || '';

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
          WL.JSONStore.get(this.collectionName).find(this.query, options).then((res) => {
          this.resultsDiv = JSON.stringify(res);
      }).fail((errorObject) => {
          this.resultsDiv = errorObject.msg;
      });
      } catch (e) {
          alert(e.Messages);
      }
  }
  this.findWhat = "";
}

//****************************************************
// findAll
//****************************************************
findAll(){
  this.showHideConsole("show");
  this.options["limit"] = 10;

  try {
      WL.JSONStore.get(this.collectionName).findAll(this.options).then((res) => {
          this.resultsDiv = JSON.stringify(res);
  }).fail((errorObject) => {
          this.resultsDiv = errorObject.msg;
  });
} catch (e) {
  alert(e.Messages);
}
  this.findWhat = "";
}

//****************************************************
// replaceShowDoc
//****************************************************
replaceShowDoc(){
 var obj = [];
 var id = parseInt(this.replaceDocId, 10);
 obj.push(id);
 this.showHideConsole("hide");
 try {
      WL.JSONStore.get(this.collectionName).findById(obj,{}).then((res) => {
          this.replaceName = res[0].json.name;
          this.replaceAge = res[0].json.age;
      }).fail((errorObject) => {
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
  this.replaceDocId = "";
  this.replaceName = "";
  this.replaceAge = "";
  this.ReplaceDocDiv = true;
}

//****************************************************
// replaceDoc
//****************************************************
replaceDoc(){
  var doc_id = parseInt(this.replaceDocId, 10);
  var doc_name = this.replaceName;
  var doc_age = this.replaceAge;
  var doc = {_id: doc_id, json: {name: doc_name, age: doc_age}};

  var options = {
      push: true
  }

  WL.JSONStore.get(this.collectionName).replace(doc, options).then((numberOfDocumentsReplaced) => {
      this.showHideConsole("show");
      this.resultsDiv = "Document updated successfuly";
      this.clearAndHideReplaceDiv();
  })
  .fail((errorObject) => {
      this.resultsDiv = "Failed to update document: " + errorObject.msg
      this.clearAndHideReplaceDiv();
  });
}

//****************************************************
// removeDoc
//****************************************************
removeDoc(){
  this.showHideConsole("show");
  var id = parseInt(this.docId, 10);
  var query = {_id: id};
  var options = {exact: true};
  try {
    WL.JSONStore.get(this.collectionName).remove(query, options).then((res) => {
          this.resultsDiv = "Documents removed: " + JSON.stringify(res)
  }).fail((errorObject) => {
          this.resultsDiv = errorObject.msg
  });
  } catch (e) {
  alert(e.Messages);
}
  this.docId = "";
}

//****************************************************
// countDocs
//****************************************************
countDocs(){
  try {
    WL.JSONStore.get(this.collectionName).count({},{}).then((res) => {
          this.resultsDiv = "Number of documents in the collection: " + res;
  }).fail((errorObject) => {
          this.resultsDiv = errorObject.msg;
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

      .then((responseFromAdapter) => {
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

      .then((res) => {

         // Handle change success.
        this.resultsDiv = JSON.stringify(res) + " Documents Loaded From Adapter" ;
      })

      .fail((errorObject) => {
        // Handle failure.
        this.resultsDiv = errorObject.msg;
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
      WL.JSONStore.get(this.collectionName).getAllDirty({}).then((res) => {
          this.resultsDiv = "Dirty Documents:\n" + JSON.stringify(res);
      }).fail((errorObject) => {
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

      .then((arrayOfDirtyDocuments) => {
        // Handle getAllDirty success.

        dirtyDocs = arrayOfDirtyDocuments;

        var resource = new WLResourceRequest("adapters/JSONStoreAdapter/pushPeople", WLResourceRequest.POST);
        resource.setQueryParameter('params', dirtyDocs);
        resource.addHeader("Content-Type","application/x-www-form-urlencoded");
        return resource.send();
      })

      .then((responseFromAdapter) => {
        // Handle invokeProcedure success.

        // You may want to check the response from the adapter
        // and decide whether or not to mark documents as clean.
        return WL.JSONStore.get(this.collectionName).markClean(dirtyDocs, {});
      })

      .then((res) => {
        // Handle markClean success.
        this.resultsDiv = JSON.stringify(res) + "Documents Pushed Successfully";

      })

      .fail((errorObject) => {
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
  var newPassword = this.newPassword;
  if(newPassword == ""){
      alert("Please enter new password");
  }
  else{
      WL.JSONStore.changePassword(this.options["password"], newPassword, this.options["username"], {}).then(() => {
          this.resultsDiv = "Password changed successfuly"
      }).fail((errorObject) => {
          this.resultsDiv = "Failed to change password:\n" + errorObject.msg
      });
  }
}

//****************************************************
// getFileInfo
//****************************************************
getFileInfo(){
  try {
      WL.JSONStore.fileInfo()
      .then((res) => {
          this.resultsDiv = JSON.stringify(res);
      })
      .fail(() => {
          alert("Failed To Get File Information");
      });
  } catch (e) {
      alert("Failed To Get File Information");
  }
}
}


