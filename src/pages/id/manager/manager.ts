import { Component,OnInit } from '@angular/core';
import {BaseComponent} from "./../../../app/BaseComponent";
import {Config} from '../../../providers/Config';
/**
 * Generated class for the LauncherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'id-manager',
  templateUrl: 'manager.html',
})
export class IdManagerComponent extends BaseComponent implements OnInit{
  public kycIdArr:any=[];
  public isSelectObj:any={};
  selectAll = false;
  ngOnInit(){
    this.setTitleByAssets('text-id-manager');
    let kycObj = Config.getKycObj();
    if(this.isEmptyObject(kycObj)){
        this.localStorage.get('kyc').then((val)=>{
        if(val === null){
          this.kycIdArr = [];
        }else{
          this.kycIdArr = this.objtoarr(JSON.parse(val));
        }
        Config.setKycObj(JSON.parse(val));
      });
       return;
    }
    this.kycIdArr = this.objtoarr(Config.getKycObj());
  }

  onItem(id){

      if(this.isNull(this.isSelectObj[id])){
        this.isSelectObj[id] = true;
        this.selectAll=this.setAllButton();
        return;
      }
      this.isSelectObj[id] = !this.isSelectObj[id];
      this.selectAll=this.setAllButton();
  }

  onNext(type){

    switch (type){

      case 1:   //导出
         let improtids = this.getSelsetId();
         this.downButton(improtids);
        break;
      case 2:   //删除
      let delids = this.getSelsetId();
      console.log(JSON.stringify(delids));
        break;
      case 3:
        this.selectAll = !this.selectAll;
        this.setSelectAll(this.selectAll);
        break;
    }
  }

  setSelectAll(stauts)
  {
     for(let key in Config.getKycObj()){
       this.isSelectObj[key] = stauts;
     }
  }

  getSelsetId(){
    let arr = [];
    for(let key in this.isSelectObj){
        if(this.isSelectObj[key]){
          arr.push(key);
        }
    }
    return arr;
  }

  setAllButton(){
    let isCheck:any=true;
    for(let key in this.isSelectObj){
        if(!this.isSelectObj[key]){
             isCheck = false;
             return isCheck;
        }
    }
        return isCheck;
  }

  downButton(ids){

    if(ids.length===0){
      this.messageBox("text-down-please-message");
         return;
    }
     let idsObj = {};
     let kycObj =Config.getKycObj();
     for(let id in ids){
      let key =ids[id];
      idsObj[key] = kycObj[key];
     }
    this.backupProvider.idsDownload(JSON.stringify(idsObj),"exportId.txt").then(()=>{
       this.messageBox("text-down-sucess-message");
    }).catch(()=>{
      this.messageBox("text-down-fail-message");
    });
  }
}