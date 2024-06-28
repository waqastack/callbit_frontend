import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ManageAccountService {


  constructor(private service: GenericService) { }

  ChangePassword(compaign){
    return this.service.ApiPostMethod('Auth/changePassword',compaign);
  }
//   getAllCompaign(){
//     return this.service.ApiGetMethod('Compaign/getAll');
//   }
//   getSingleCompaign(id){
//     return this.service.ApiGetMethod('Compaign/getSingle?id='+id);
//   }
//   SubmitProposal(data){
//     return this.service.ApiPostMethod('Compaign/SubmitProposal',data);
//   }
}
