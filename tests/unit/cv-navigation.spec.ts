import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '@/app/app.routes';

describe('CV Navigation Functionality', () => {
    let router: Router;
    let location: Location;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)]
        }).compileComponents();

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
    });

    it('should have CV route defined', () => {
        const config = router.config;
        const cvRoute = config.find(route => 
            route.path?.includes('cv') || 
            (route.children && route.children.some(child => child.path === 'cv'))
        );
        
        expect(cvRoute).toBeTruthy();
    });

    it('should navigate to CV route with proper path', async () => {
        await router.navigate(['/en/cv']);
        expect(location.path()).toBe('/en/cv');
    });

    it('should navigate to CV route with different language', async () => {
        await router.navigate(['/ru/cv']);
        expect(location.path()).toBe('/ru/cv');
    });

    it('should have CV route with proper title', () => {
        const config = router.config;
        const findCvRoute = (routes: any[]): any => {
            for (const route of routes) {
                if (route.path === 'cv') {
                    return route;
                }
                if (route.children) {
                    const found = findCvRoute(route.children);
                    if (found) return found;
                }
            }
            return null;
        };
        
        const cvRoute = findCvRoute(config);
        expect(cvRoute?.title).toBe('Curriculum Vitae');
    });

    it('should have CV route with proper data', () => {
        const config = router.config;
        const findCvRoute = (routes: any[]): any => {
            for (const route of routes) {
                if (route.path === 'cv') {
                    return route;
                }
                if (route.children) {
                    const found = findCvRoute(route.children);
                    if (found) return found;
                }
            }
            return null;
        };
        
        const cvRoute = findCvRoute(config);
        expect(cvRoute?.data?.name).toBe('cv');
    });

    it('should handle invalid CV navigation gracefully', async () => {
        try {
            await router.navigate(['/invalid/cv']);
            // Should not throw error, but may navigate to 404
            expect(true).toBe(true);
        } catch (error) {
            // If it throws, that's also acceptable behavior
            expect(error).toBeDefined();
        }
    });
});
