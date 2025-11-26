package com.football.backend.controllers;

import com.football.backend.dto.MatchCreateRequest;
import com.football.backend.dto.MatchDetailsDto;
import com.football.backend.dto.MatchListDto;
import com.football.backend.dto.MatchUpdateRequest;
import com.football.backend.dto.MatchEventCreateRequest;
import com.football.backend.dto.MatchEventDto;
import com.football.backend.mappers.MatchEventMapper;
import com.football.backend.mappers.MatchMapper;
import com.football.backend.models.Match;
import com.football.backend.models.MatchEvent;
import com.football.backend.services.MatchEventService;
import com.football.backend.services.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;
    private final MatchEventService matchEventService;
    private final MatchMapper matchMapper;
    private final MatchEventMapper matchEventMapper;

    @GetMapping("/schedule")
    public List<MatchListDto> getSchedule() {
        return matchService.getSchedule().stream()
                .map(matchMapper::toListDto)
                .toList();
    }

    @GetMapping("/results")
    public List<MatchListDto> getFinishedMatches() {
        return matchService.getFinishedMatches().stream()
                .map(matchMapper::toListDto)
                .toList();
    }

    @GetMapping
    public List<MatchListDto> getAllMatches() {
        return matchService.getAllMatches().stream()
                .map(matchMapper::toListDto)
                .toList();
    }

    @GetMapping("/{id:[0-9a-fA-F\\-]{36}}")
    public MatchDetailsDto getMatch(@PathVariable UUID id) {
        Match match = matchService.getMatch(id);
        List<MatchEvent> events = matchEventService.getEventsForMatch(id);
        return matchMapper.toMatchDetailsDto(match, events);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MatchDetailsDto createMatch(@RequestBody MatchCreateRequest request) {
        Match match = matchService.createMatch(request);
        return matchMapper.toMatchDetailsDto(match, List.of());
    }

    @PutMapping("/{id:[0-9a-fA-F\\-]{36}}")
    public MatchDetailsDto updateMatchStatus(@PathVariable UUID id,
                                             @RequestBody MatchUpdateRequest request) {
        Match match = matchService.updateMatch(id, request);
        List<MatchEvent> events = matchEventService.getEventsForMatch(id);
        return matchMapper.toMatchDetailsDto(match, events);
    }

    @PostMapping("/{id:[0-9a-fA-F\\-]{36}}/events")
    @ResponseStatus(HttpStatus.CREATED)
    public MatchEventDto addEvent(@PathVariable UUID id,
                                  @RequestBody MatchEventCreateRequest request) {
        // enforce path matchId over body, to avoid mismatch
        request.setMatchId(id);
        MatchEvent event = matchEventService.addEvent(request);
        return matchEventMapper.toEventDto(event);
    }

    @GetMapping("/{id:[0-9a-fA-F\\-]{36}}/events")
    public List<MatchEventDto> getEvents(@PathVariable UUID id) {
        return matchEventService.getEventsForMatch(id).stream()
                .map(matchEventMapper::toEventDto)
                .toList();
    }

    @DeleteMapping("/{id:[0-9a-fA-F\\-]{36}}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMatch(@PathVariable UUID id) {
        matchService.deleteMatch(id);
    }
}
