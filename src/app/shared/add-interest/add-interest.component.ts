import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {SharedService} from '../../services/shared.service';
import {Project} from '../../models/Project.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {InterestsService} from '../../services/interests.service';

@Component({
  selector: 'app-add-interest',
  templateUrl: './add-interest.component.html',
  styleUrls: ['./add-interest.component.scss'],
})
export class AddInterestComponent implements OnInit {

    @Input() project:Project;
    @Input() username:string;
    @Input() direction:string
    form:FormGroup;

    constructor(
                private sharedService:SharedService,
                private modalCtrl:ModalController,
                private alertCrl:AlertController,
                private interestsService:InterestsService) { }


    ngOnInit() {

        this.form=new FormGroup({
            message:new FormControl('',{
                updateOn:'change',
                validators:[Validators.required,
                    Validators.minLength(6),
                Validators.maxLength(100)]
            })
        })


    }


    OnMakeInterest(){
        console.log(this.username,this.project.id,this.form.value['message'],this.direction)
        this.interestsService.addInterest(this.username,this.project.id,this.form.value['message'],this.direction).subscribe(
            ()=>{},
            (error)=>{this.sharedService.showAlert(error)},
            ()=>{ this.modalCtrl.dismiss({},'success');
            }
        )
    }

    onCancel() {
        this.modalCtrl.dismiss({},'cancel');
    }
    private clearFields(){
        this.form.reset()
    }

}
