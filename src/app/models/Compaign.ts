export class CompaignRequest {
  id: number;
  title: string;
  name: string;
  type: string;
  description: string;
  uploadFile: string;
  payType: string;
  describe: string;
  price: string = '0';
  userID: number;
  isDeleted: boolean;
  setOwnPriceRbtn: boolean;
  paySale: number;
  payPrice: number;
  totalAmount: number;
  payByText: string;
  payPerText: string;
  payPerTextOther: string;
  compaignText: string;
  amountDeducted: number;
  compaignDuration: string;
  questions: string[];
  latitude:string;
  longitude:string;
  location:string;
  FileNames: string;
  inBound: boolean;
  outBound: boolean;
  constructor() {
    this.payByText = 'Pay By the Sales';
    this.payPerText = 'Pay Per Transfer';
    this.payPerTextOther = 'Other';
    this.compaignDuration = 'Less than 7 days';
    this.payType = 'Part-Time';
    this.totalAmount = 0;
    this.FileNames = "";
    this.questions = [];
    this.inBound = false;
    this.outBound = false;
  }
}
export class Compaign {
  id: number;
  title: string;
  name: string;
  type: string;
  description: string;
  uploadFile: string;
  payType: string;
  describe: string;
  price: string;
  userID: number;
  userid: number;
  questions: string[];
  location:string;
  FileNames: string;
}
export class CompaignResponse {
  id: number;
  title: string;
  name: string;
  type: string;
  description: string;
  uploadFile: string;
  payType: string;
  describe: string;
  price: string;
  userID: number;
  createdDate: string;
  isDeleted: boolean;
  setOwnPriceRbtn: boolean;
  Sale: number;
  sale: number;
  totalAmount: number;
  payByText: string;
  payPerText: string;
  compaignText: string;
  amountDeducted: number;
  compaignDuration: string;
  typeCompaign: string[];
  questions: any;
  location:string;
  noOfProposals: number;
  contractStart: boolean;
  FileNames: string;
}
export class CompaignType {
  type: string;
}
export class SubmitProposalModel {
  //proposalID: number;
  CompaignID: number;
  UserID: number;
  salesRate: number = 0;
  numberofSales: number = 0;
  clientRecive: number = 0;
  coverLetter: string;
  proposalStatus: string;
  uploadFile: string;
  clientID: string;
  Answers: CampaignAnswer[];
  // payType: string;
  // describe: string;
  // price: number;
}
export class CampaignAnswer {
  Id: number | undefined;
  QuestionId: number;
  Answer: string;
}
export class CampaignQuestion {
  question: string | undefined;
  Id: number | undefined;
}

export class CompaignEditableShow {
  payByText: boolean;
  payPerText: boolean;
  title: boolean;
  typeKeyword: boolean;
  desc: boolean;
  price: boolean;
  sale: boolean;
  compaignDuration: boolean;
  constructor() {
    this.payByText = false;
    this.payPerText = false;
    this.title = false;
    this.desc = false;
    this.price = false;
    this.sale = false;
    this.compaignDuration = false;
    this.typeKeyword = false;
  }
}
export class CompaignEditRequest {
  id: number;
  title: string;
  name: string;
  type: string;
  description: string;
  uploadFile: string;
  payType: string;
  describe: string;
  price: string = '0';
  userID: number;
  isDeleted: boolean;
  setOwnPriceRbtn: boolean;
  paySale: number;
  sale: number;
  payPrice: number;
  totalAmount: number;
  payByText: string;
  payPerText: string;
  compaignText: string;
  amountDeducted: number;
  compaignDuration: string;
}
