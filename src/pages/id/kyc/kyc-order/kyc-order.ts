import { Component ,OnInit} from '@angular/core';
import {BaseComponent} from "../../../../app/BaseComponent";
import {IdKycResultComponent} from "../../../../pages/id/kyc/result/result";
import {IDManager} from "../../../../providers/IDManager";
import {ApiUrl} from "../../../../providers/ApiUrl";
import { kycSelectTypeComponent } from '../selecttype/create';
@Component({
  selector: 'page-kyc-order',
  templateUrl: 'kyc-order.html',
})
export class KycOrderPage  extends BaseComponent implements OnInit{
  serialNumList = [];
  orderList:any;
  params:any;
  did:any;
  aprType:any;
  ngOnInit(){
     this.params = this.getNavParams().data;
     this.did = this.params["id"];
     if(this.params["type"] === "company"){
         this.aprType = "company"
     }else{
         this.aprType = "person"
     }
     alert("---params----"+JSON.stringify(this.params));
     this.setTitleByAssets("text-id-kyc-order-list");
     this.localStorage.getKycList("kyc").then((val=>{
            alert("---kyclist---"+val);
            this.orderList = JSON.parse(val)[this.did]["kyc"][this.aprType]["order"];
            alert("---orderList---"+JSON.stringify(this.orderList));
            this.serialNumList = this.objtoarr(this.orderList);
            alert("---serialNumList---"+JSON.stringify(this.serialNumList))
     }));
  }

  onNext(item) {
      this.getAppAuth(item["serialNum"],item["txHash"]);
  }

    getAppAuth(serialNum,txHash){
    alert("---serialNum---"+serialNum+"---serialNum---"+txHash);
    let timestamp = this.getTimestamp();
    let parms ={"serialNum":serialNum,
                "txHash":txHash,
                "timestamp":timestamp,
               }
    let checksum = IDManager.getCheckSum(parms,"asc");
    parms["checksum"] = checksum;
    this.getHttp().postByAuth(ApiUrl.APP_AUTH,parms).toPromise().then().then(data => {
      if(data["status"] === 200){
        alert("sssss======="+JSON.stringify(data));
        let authResult = JSON.parse(data["_body"]);
        if(authResult["errorCode"] === "4"){
            this.messageBox("text-id-kyc-auth-uncompleted");
               return;
        }
        if(authResult["errorCode"] === "0"){
            this.params["adata"] = authResult["data"];
            this.Go(IdKycResultComponent,this.params);
        }
       }
    }).catch(error => {

    });
  }
}