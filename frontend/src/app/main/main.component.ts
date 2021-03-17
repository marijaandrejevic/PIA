import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { MyserviceService } from '../myservice.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = "BO8q7xzIVv7rs8M_S0Q8sduLOzYJAl6lRXI_DCO9cF1khV9iit711kXLmwOgWKWFsdok1vXe8qxdj0MUICAsdX4"
  constructor(private swPush: SwPush, private myserver: MyserviceService) {
    /*this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(sub => {
      console.log(sub);
      console.log(typeof (sub.endpoint))
      console.log(typeof (sub.expirationTime))
      console.log(typeof (sub.getKey('auth')))
      console.log(typeof (sub.getKey('p256dh')))
      console.log(sub.getKey('auth'))
      console.log(sub.getKey('p256dh'))
      this.myserver.mainsubscribe(sub).subscribe((res: any) => {
        console.log(res);

      },
        (err) => {
          console.log('Error: ' + err);
        }
      );
    })
      .catch(err => console.error("Ne moze da se subscribe-uje"));*/

      /*this.swPush.unsubscribe().then(()=> {
        console.log("Unsubscribed");
      }).catch(e=> {
        console.error(e);
      })*/
      
  }

  ngOnInit(): void {
  }

}
