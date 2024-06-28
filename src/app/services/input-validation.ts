import { TitleCasePipe } from "@angular/common";

export class InputValidations {


    titleCasePipe: TitleCasePipe = new TitleCasePipe();



    restrictNameSpace(event: any) {
        let value: any = (event.target as HTMLInputElement).value;


        if (event.which === 32 && event.target.selectionStart === 0) {
            event.preventDefault();
            return;
        }
    }

    restrictFirstSpace(event: any) {
  
        let value: any = (event.target as HTMLInputElement).value;
        if (event.which === 32 && event.target.selectionStart === 0) {
            event.preventDefault();
            return;
        }
    }
    specialCharacterValidation(event: any) {
        if (event.which === 60 || event.which === 62 || event.which === 39) {
            event.preventDefault();
            return;
        }
    }
    alphaWithNumbers(event: any) {

        let value: any = (event.target as HTMLInputElement).value;
        if (!value && event.which === 32) {
            event.preventDefault();
            return;
        }

        if (event.which === 91 || event.which === 92 || event.which === 93 || event.which === 94 || event.which === 95 || event.which === 96 ||
            event.which === 58 || event.which === 59 || event.which === 60 || event.which === 61 || event.which === 62 || event.which === 63 || event.which === 64) {
            event.preventDefault();
            return;
        }
        if ((event.which < 48 || event.which > 122) && (event.which != 8) && (event.keyCode != 9) && (event.which != 32)) {
            event.preventDefault();
            return;
        }
    }

    resetCNICMasking(value: any) {
        if (value != null && value != "" && value != undefined) {
            value = value.replace("-", "").replace("-", "").trim();
        }
        return value;
    }

    alphaWithNumbersRestrictSpace(event: any) {
 
        let value: any = (event.target as HTMLInputElement).value;
        if (event.which === 32) {
            event.preventDefault();
            return;
        }

        if (event.which === 91 || event.which === 92 || event.which === 93 || event.which === 94 || event.which === 95 || event.which === 96 ||
            event.which === 58 || event.which === 59 || event.which === 60 || event.which === 61 || event.which === 62 || event.which === 63 || event.which === 64) {
            event.preventDefault();
            return;
        }
        if ((event.which < 48 || event.which > 122) &&(event.which != 45)&& (event.which != 8) && (event.keyCode != 9) && (event.which != 32)) {
            event.preventDefault();
            return;
        }
    }

    emailValidate(event: any) {
        let value: any = (event.target as HTMLInputElement).value;
        if (event.which === 91 || event.which === 92 || event.which === 93 || event.which === 94  || event.which === 96) {
            event.preventDefault();
            return;
        }
        if ((event.which < 48 || event.which > 122) && (event.which != 8) && (event.keyCode != 9) && (event.which != 46) ) {
            event.preventDefault();
            return;
        }
    }

    apphabetsNumbersWithDashValidate(event: any) {
        let value: any = (event.target as HTMLInputElement).value;
        if (event.which === 91 || event.which === 64 || event.which === 92 || event.which === 93 || event.which === 94
            || event.which === 95 || event.which === 96 || event.which === 61 || event.which === 59 || event.which === 58) {
            event.preventDefault();
            return;
        }
        if ((event.which < 48 || event.which > 122) && (event.which != 45) && (event.which != 32)) {
            event.preventDefault();
            return;
        }
    }
 
    inputToTitleCase(event: any) {
        let value: any = (event.target as HTMLInputElement).value;
        if (value) {
            event.target.value = this.titleCasePipe.transform(value);
        }
        return;
    }





    static language_List(){
        var languages = [
            { "name": "Arabic" }, { "name": 'Armenian' }, { "name": 'Bengali' },
            { "name": 'English' }, { "name": 'French' }, { "name": 'Greek' },
            { "name": 'Gujarati' }, { "name": 'Hindi' }, { "name": 'Italian' }, { "name": 'Japanese' }, { "name": 'Korean' },
            { "name": 'Persian' }, { "name": 'Polish' }, { "name": 'Portuguese' }, { "name": 'Russian' },{"name":"Swedish"}, { "name": 'Spanish' },
            { "name": 'Tagalog' }, { "name": 'Urdu' }, { "name": 'Vietnamese'}, { "name": 'Declined to specify' },];
            return languages;
    }

 
    static Gender_List(){
        var genders = [
            { "gender": "Male" }, { "gender": 'Female' }, { "gender": 'Other' }];
            return genders;
    }

}