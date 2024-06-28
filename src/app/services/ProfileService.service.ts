import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private service: GenericService) {
    const proPics: any[] = JSON.parse(localStorage.getItem('currentUser'))
      ?.profilePic?.result;
      try{
    this.profilePic = new BehaviorSubject<string>(
      `${environment.apiDomain}/${proPics[proPics?.length - 1]?.portFolioPath}`
    );}
    catch{
      this.profilePic = new BehaviorSubject<string>('assets/images/default-profile-pic.png');
    }
  }
  
  profilePic: BehaviorSubject<string>; // = new BehaviorSubject<string>(null);


  UploadProfilePicture(data:any){
    return this.service.ApiPostMethodImages('Profile/UploadProfilePicture',data);
  }
  UploadMsgAtt(data:any){
    return this.service.ApiPostMethodImages('Profile/FileUploadMSG',data);
  }
  UploadFiles(data:any){
    return this.service.ApiPostMethodImages('Profile/fileupload',data);
  }
  GetProfilePicture(id):any{
    return this.service.ApiGetMethod('Profile/getProfilePicture?id='+id);
  }

  GetProfileInfo(id){
    return this.service.ApiGetMethod('Profile/getProfileInfo?id='+id);
  }
  ProfileInfo(data){
    return this.service.ApiPostMethod('Profile/profileInfo',data);
  }
  PortfolioInfo(data):any{
    return this.service.ApiPostMethod('Profile/portfolioInfo',data);
  }
  GetPortfolioInfo(id):any{
    return this.service.ApiGetMethod('Profile/getPortfolioInfo?id='+id);
  }
  getProfilePic(id): Observable<string> {
    this.service.ApiGetMethod('Profile/GetProfilePicture?id=' + id).subscribe({
      next: (res: any) => {
        if (res.length != 0) {
          //for (var item of res) {
            this.profilePic.next(
              environment.apiDomain + '/' + res
            );
          //}
        }
      },
    });
    return this.profilePic.asObservable();
  }
  RemovePortfolioInfo(portFolioID,profileID):any{
    return this.service.ApiGetMethod('Profile/removePortfolioInfo?portFolioID='+portFolioID+'&profileID='+profileID);
  }
  SaveCardInfo(obj): any {
    return this.service.ApiPostMethod('Profile/SaveCardInfo', obj);
  }
}
