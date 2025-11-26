package com.football.backend.dto;

import com.football.backend.entities.ContractEntity;
import lombok.Getter;

import java.util.Date;
import java.util.UUID;

@Getter
public class ContractDto {
    private UUID id;
    private String teamName;
    private Date startDate;
    private Date endDate;
    private Integer salaryPerYear;

    public ContractDto(ContractEntity contract) {
        this.id = contract.getId();
        this.teamName = contract.getTeam().getName();
        this.startDate = contract.getStartDate();
        this.endDate = contract.getEndDate();
        this.salaryPerYear = contract.getSalaryPerYear();
    }

}
