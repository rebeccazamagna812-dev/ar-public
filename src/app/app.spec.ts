import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    });
  });

  it('renderiza apenas o <router-outlet> (o layout vem da rota Shell)', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;
    expect(raiz.children.length).toBe(1);
    expect(raiz.querySelector('router-outlet')).not.toBeNull();
  });
});
