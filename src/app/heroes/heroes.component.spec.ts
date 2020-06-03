import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HeroService } from '../hero.service';
import { HeroesComponent } from './heroes.component';
import { HEROES } from '../mock-heroes';
import { Hero } from '../hero';

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
    })

    const req = httpTestingController.expectOne('api/heroes');

    expect(req.request.method).toEqual('GET');

    req.flush(HEROES);
  });

  it('should add a hero', async () => {
    const heroesList: Array<Hero> = HEROES;
    const postBody = { name: 'Batman' };
    heroService.addHero(postBody as Hero).subscribe(item => {
      heroesList.push(item);
      const hero = heroesList.find(hero => hero.name === 'Batman');
      expect(hero.name).toEqual('Batman');
    });
    const req = httpTestingController.expectOne('api/heroes');
    expect(req.request.method).toEqual('POST');
    req.flush(postBody);
  });
});
