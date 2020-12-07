import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InterestViewComponent } from './interest-view.component';

describe('InterestViewComponent', () => {
  let component: InterestViewComponent;
  let fixture: ComponentFixture<InterestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestViewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InterestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
