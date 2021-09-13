import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() back:string = '';
  constructor(
    private menu: MenuController,
  ) { }

  ngOnInit() {}

  openMenu(){
      this.menu.enable(true, 'menu');
      this.menu.open('menu');
  }
}
