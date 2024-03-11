# SbNotifications

    A light and easy to use custom notifications library along with the sunbird notifcation service.

## Demo link

## Instalation

    npm install --save sb-notifications
                or
    yarn add sb-notifications

## Setup 

   1. Import SbNotificationsModule module into root module or any feature module in your application.

        @NgModule({
            declarations: [
                AppComponent
            ],
            imports: [
                SbNotificationsModule.forRoot({
                    configuration: {
                            domain:'',
                            production: false,
                            userId:'',
                            authorization: '',
                            framework:''
                    }
                }),
        ],
        providers: [],
        bootstrap: [AppComponent]
        })
        export class AppModule { }

    2.  Add following components in the routing module as children.

            NotificationListComponent,
            CreateNotificationComponent
            
    3.  Supporting sunbird api's

            Create Notification api:

                /learner/user/feed/v2/create
                
            Framework read api:

                /api/framework/v1/read/
            
            Department List api:

                /learner/user/v1/department/list

            Notification list: 
            /learner/user/v1/notification/list/true
            /learner/user/v1/notification/list/false
            


