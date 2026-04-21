package com.group10.rosterflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCleanupScheduler {

    private final AdminService adminService;

    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupDisabledUsers() {
        adminService.hardDeleteDisabledUsers();
    }
}
