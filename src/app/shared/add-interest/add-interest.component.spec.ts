import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddInterestComponent } from './add-interest.component';

describe('AddInterestComponent', () => {
  let component: AddInterestComponent;
  let fixture: ComponentFixture<AddInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInterestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
