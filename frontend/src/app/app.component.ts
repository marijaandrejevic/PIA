import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { MyserviceService } from './myservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  private publicKey = "BO8q7xzIVv7rs8M_S0Q8sduLOzYJAl6lRXI_DCO9cF1khV9iit711kXLmwOgWKWFsdok1vXe8qxdj0MUICAsdX4";
  constructor(private swPush: SwPush, private myservice: MyserviceService) {
   // this.pushSubscription();
  }


  ngOnInit(){
    //this.pushSubscription();
  }
  

  pushSubscription() {
    if(!this.swPush.isEnabled) {
      console.log("Notification is not enabled");
      return;
    }
    this.swPush.requestSubscription({
      serverPublicKey: this.publicKey,
    }).then(sub=> 
      {
        console.log(sub);
        this.myservice.mainsubscribe(sub).subscribe(res=> {
          console.log(res)
        }, (err)=> {
          console.log(err);
        })
      }).catch(err=>console.log(err))
  }
 
 
  
}
