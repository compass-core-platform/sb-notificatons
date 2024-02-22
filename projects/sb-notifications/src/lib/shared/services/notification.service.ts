import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';



const POSITION_COLUMNS =  ['select', 'position', 'noOfMembers'];
const ROLE_COLUMNS = ['select', 'role', 'noOfMembers'];
const DEPARTMENT_COLUMNS = ['select', 'department', 'noOfMembers'];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(@Inject('config') private config:any, private http:HttpClient) { }

  get configuration(){
    return this.config.configuration.environment;
  }

  getFrameworkDetails(){
    return this.http.get(`/api/framework/v1/read/${this.configuration.framework}?categories=`).pipe(
      map((res:any) => {
        return res.result.framework;
      })
    )
  }

  sendOnlyWhenTaxonomy(len:any){
    const roleORPosition = len.filter((tr:any) => tr.type === 'position' || tr.type === 'role').map((r:any) => r.term)||[];
    return roleORPosition.length ? [this.config.configuration.environment.framework] : [];
  }

  createNotification(req: any){
    const payload = {
      "request": {
          "data": [
              { "type": "email",
              "priority": 1,
              "action": {
                  "template": {
                      "config": {
                          "sender": this.config.configuration.email,
                          "topic": null,
                          "otp": null,
                          "subject": req.notificationTitle
                      },
                      "type": "email",
                      "data": `<!doctype html>
                      <html>
                         <head>
                            <meta name=\"viewport\" content=\"width=device-width\">
                            <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">
                            <title></title>
                            <style>/* ------------------------------------- INLINED WITH htmlemail.io/inline ------------------------------------- */ /* ------------------------------------- RESPONSIVE AND MOBILE FRIENDLY STYLES ------------------------------------- */ @media only screen and (max-width: 620px){table[class=body] h1{font-size: 28px !important; margin-bottom: 10px !important;}table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a{font-size: 16px !important;}table[class=body] .wrapper, table[class=body] .article{padding: 10px !important;}table[class=body] .content{padding: 0 !important;}table[class=body] .container{padding: 0 !important; width: 100% !important;}table[class=body] .main{border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;}table[class=body] .btn table{width: 100% !important;}table[class=body] .btn a{width: 100% !important;}table[class=body] .img-responsive{height: auto !important; max-width: 100% !important; width: auto !important;}}/* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all{.ExternalClass{width: 100%;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.apple-link a{color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important;}.btn-primary table td:hover{background-color: #34495e !important;}.btn-primary a:hover{background-color: #34495e !important; border-color: #34495e !important;}}</style>
                         </head>
                         <body class=\"\" style=\"background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"body\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;\">
                         <tr><td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top;\"></td><td class=\"container\" style=\"font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;\"><div class=\"content\" style=\"box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;\"><span class=\"preheader\" style=\"color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;\"></span><table class=\"main\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;\">
                         <tr><td class=\"wrapper\" style=\"font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;\">
                         <tr></tr>
                         <tr>
                            <td></td>
                         </tr>
                         <td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top;\">
                              <p style=\"font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;\">${req.notificationText}</p>
                              <p style=\"font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;\">${req.contentType}</p>
                              <p><img src=\"https://img.freepik.com/premium-vector/compass-logo-vector-compass-logo-template_10250-4962.jpg\" alt=\"compass\" style=\"display:block; margin:auto; max-width:100%; height:auto;\"> </p>
                          </td>
                          </table>
                      </td></tr></table></div></td></tr></table><td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top;\"></td></body>
                      </html>`,
                      "id": "cbplanContentRequestTemplate",
                      "params": {}
                  },
                  "type": "email",
                  "category": "email",
                  "createdBy": {
                      "id": this.config.configuration.userId,
                      "type": "user"
                  }
              }
              }
          ],
          "filters": {
             "profileDetails.professionalDetails.designation":req.audience.filter((tr:any) => tr.type === 'position').map((r:any) => r.term)||[],
              "framework.taxonomyCategory1":req.audience.filter((tr:any) => tr.type === 'position').map((r:any) => r.term)||[],
              "framework.taxonomyCategory2":req.audience.filter((tr:any) => tr.type === 'role').map((r:any) => r.term)||[],
              "framework.taxonomyCategory3":[],
              "framework.taxonomyCategory4":[],
              "framework.taxonomyCategory5":[],
              "framework.id":this.sendOnlyWhenTaxonomy(req.audience),
              "profileDetails.employmentDetails.departmentName":req.audience.filter((tr:any) => tr.type === 'department').map((r:any) => r.term)||[],
          },
          "dataValue": req.notificationText
      }
    }   
   return this.http.post('/learner/user/feed/v2/create', payload);
  }

  getCategorybasedAudienceList(frameworkDetails:any, type:any) {
    return frameworkDetails.categories.filter((c:any) => c.name.toLowerCase() == type+'s'.toLowerCase())[0].terms;
  }
  
  getDisplayColumns(aud:any){
      switch(aud) {
        case 'position': return POSITION_COLUMNS;
        case 'role': return  ROLE_COLUMNS;
        case 'department': return DEPARTMENT_COLUMNS
        default:return;
      }

  }

  departmentList(){ 
    const payload = {
      "request": {
          "filters": {},
          "limit": 100
      }
    }
    return this.http.post('/learner/user/v1/department/list', payload);
  }
}
