import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';
import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let heroService: HeroService;
  let httpTestingController: HttpTestingController;

  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      declarations: [
        HeroesComponent
      ],
      providers: [
        HeroService
      ]
    }).compileComponents();

    heroService = TestBed.get(HeroService);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  it('should be created', () => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should load hero list', () => {
    heroService.getHeroes().subscribe(heroes => {
      expect(heroes).toBeTruthy();
      expect(heroes.length).toBe(10);

      const hero = heroes.find(hero => hero.id === 20);
      expect(hero.name).toBe('Tornado');
    });
    const req = httpTestingController.expectOne('api/heroes');
    expect(req.request.method).toEqual('GET');
    req.flush(HEROES);
  });

  it('should add a hero', () => {
    const responseBody = { id: 21, name: 'Batman' };
    heroService.addHero({ name: 'Batman' } as Hero).subscribe(item => {
      expect(item.id).toEqual(21);
    });
    const req = httpTestingController.expectOne('api/heroes');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.name).toEqual(responseBody.name);
    req.flush(responseBody);
  });
});
