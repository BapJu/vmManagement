<?php

// Fonction pour générer le fichier YAML
function generateYAML($data) {
    $yaml = "clones:\n";
    foreach ($data as $clone) {
        $yaml .= "  - template_vmid: " . $clone['template_vmid'] . "\n";
        $yaml .= "    vmid: " . $clone['vmid'] . "\n";
        $yaml .= "    static_ip: " . $clone['static_ip'] . "\n";
        $yaml .= "    gateway: " . $clone['gateway'] . "\n";
        $yaml .= "    cloneName: " . $clone['cloneName'] . "\n";
        $yaml .= "    storage: " . $clone['storage'] . "\n";
        $yaml .= "    category: " . $clone['category'] . "\n\n";
    }
    return $yaml;
}

// Fonction principale pour créer les propriétés
function mainCreateProperties($numContainers, $templateVMID, $baseStaticIP, $storage, $category, $cloneName) {
    // Générer les données pour les clones
    $clonesData = array();
    for ($i = 0; $i < $numContainers; $i++) {
        $clone = array(
            'template_vmid' => $templateVMID,
            'vmid' => $templateVMID + $i,
            'static_ip' => long2ip($baseStaticIP + $i),
            'gateway' => "10.10.48.1",
            'cloneName' => $cloneName,
            'storage' => $storage,
            'category' => $category
        );
        $clonesData[] = $clone;
    }

    // Générer le contenu YAML
    $yamlContent = generateYAML($clonesData);

    // Écrire le contenu YAML dans le fichier clones.yml
    file_put_contents('clones.yml', $yamlContent);

    echo "Fichier clones.yml généré avec succès.\n";
}

//***********************************//
//             Variables             //
//***********************************//

/*
$numContainers = 3; // Changer le nombre de conteneurs selon vos besoins
$templateVMID = 104; // Template cible
$baseStaticIP = ip2long("10.10.48.227"); // Adresse IP de départ (en tant que nombre entier)
$storage = "local-lvm";
$category = "beta application gestion";
$cloneName = "AO-devTest-Beta";


// Appeler la fonction principale
mainCreateProperties($numContainers, $templateVMID, $baseStaticIP, $storage, $category, $cloneName);
*/
?>
