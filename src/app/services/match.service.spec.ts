import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatchService } from './match.service';
import { Match } from '../models/match.model';

describe('MatchService', () => {
  let service: MatchService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MatchService]
    });
    service = TestBed.inject(MatchService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('business', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get matches by user ID', () => {
      const userId = 1;
      const matches: Match[] = [
        { id: 1, userId: 1, matchedUserId: 2, matchScore: 85 },
        { id: 2, userId: 1, matchedUserId: 3, matchScore: 90 }
      ];
      service.getMatchesByUserId(userId).subscribe(response => {
        expect(response).toEqual(matches);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/matches?userId=${userId}`);
      expect(req.request.method).toEqual('GET');
      req.flush(matches);
    });

    it('should get match by ID', () => {
      const matchId = 1;
      const match: Match = { id: 1, userId: 1, matchedUserId: 2, matchScore: 85 };
      service.getMatchById(matchId).subscribe(response => {
        expect(response).toEqual(match);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/matches/${matchId}`);
      expect(req.request.method).toEqual('GET');
      req.flush(match);
    });

    it('should create a new match', () => {
      const newMatch: Match = { id: 3, userId: 1, matchedUserId: 4, matchScore: 88 };
      service.createMatch(newMatch).subscribe(response => {
        expect(response).toEqual(newMatch);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/matches`);
      expect(req.request.method).toEqual('POST');
      req.flush(newMatch);
    });

    it('should update an existing match', () => {
      const matchId = 1;
      const updatedMatch: Match = { id: 1, userId: 1, matchedUserId: 2, matchScore: 90 };
      service.updateMatch(matchId, updatedMatch).subscribe(response => {
        expect(response).toEqual(updatedMatch);
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/matches/${matchId}`);
      expect(req.request.method).toEqual('PUT');
      req.flush(updatedMatch);
    });

    it('should delete a match', () => {
      const matchId = 1;
      service.deleteMatch(matchId).subscribe(response => {
        expect(response).toBeNull();
      });
      const req = httpTestingController.expectOne(`${service.apiUrl}/matches/${matchId}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    });
  });
});
