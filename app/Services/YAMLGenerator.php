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
            $yaml .= "    resource_pool: " . $clone['resource_pool'] . "\n\n";
        }
        return $yaml;
    }

}

