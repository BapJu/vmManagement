<?php

namespace App\Services;

class YAMLGenerator
{
    public static function generateYAML($data) {
        $yaml = "clones:\n";
        foreach ($data as $clone) {
            $yaml .= "  - template_vmid: " . $clone['template_vmid'] . "\n";
            $yaml .= "    vmid: " . $clone['vmid'] . "\n";
            $yaml .= "    static_ip: " . $clone['static_ip'] . "\n";
            $yaml .= "    gateway: " . $clone['gateway'] . "\n";
            $yaml .= "    cloneName: " . $clone['cloneName'] . "\n";
            $yaml .= "    storage: " . $clone['storage'] . "\n";
            $yaml .= "    pool: " . $clone['pool'] . "\n\n";
        }
        return $yaml;
    }

    public static function generateStopYAML($data) {
        $yaml = "clones:\n";
        foreach ($data as $clone) {
            $yaml .= "  - start_vmid: " . $clone['start_vmid'] . "\n";
            $yaml .= "    end_vmid: " . $clone['end_vmid'] . "\n";
        }
        return $yaml;
    }
}
