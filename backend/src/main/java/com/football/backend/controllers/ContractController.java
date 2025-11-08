package com.football.backend.controllers;

import com.football.backend.dto.ContractDto;
import com.football.backend.services.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/contracts")
public class ContractController {

    private final ContractService contractService;

    @Autowired
    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @GetMapping("/player/{playerId}")
    public List<ContractDto> getContractsByPlayerId(@PathVariable String playerId) {
        return contractService.getContractsByPlayerId(playerId).stream().map(ContractDto::new).collect(Collectors.toList());
    }
}
