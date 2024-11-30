import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketDisplayerComponent } from './market-displayer.component';

describe('MarketDisplayerComponent', () => {
  let component: MarketDisplayerComponent;
  let fixture: ComponentFixture<MarketDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketDisplayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
