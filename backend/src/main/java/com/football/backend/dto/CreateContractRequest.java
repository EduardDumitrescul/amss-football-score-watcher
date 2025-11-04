package com.football.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateContractRequest {
    private UUID playerId;
    private UUID teamId;
    private Date startDate;
    private Date endDate;
    private Integer salaryPerYear;
}
