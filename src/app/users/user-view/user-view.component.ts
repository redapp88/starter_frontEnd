import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../models/Project.model';
import {Interest} from '../../models/Interest.model';
import {AppUser} from '../../models/AppUser.model';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {
    @Input()user:AppUser;
    @Input()interests:Interest[];
  constructor() { }

  ngOnInit() {}

}
