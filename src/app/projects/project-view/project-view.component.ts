import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../models/Project.model';
import {Interest} from '../../models/Interest.model';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
})
export class ProjectViewComponent implements OnInit {
@Input()project:Project;
@Input()interests:Interest[];
  constructor() { }

  ngOnInit() {}

}
