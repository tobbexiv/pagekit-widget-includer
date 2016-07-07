<?php

return [
    
    'name' => 'tobbe/widget-includer',
    
    'type' => 'extension',
    
    'main' => 'Tobbe\\WidgetIncluder\\WidgetIncluderModule',
    
    'autoload' => [
        'Tobbe\\WidgetIncluder\\' => 'src'
    ],
    
    'resources' => [
        'tobbe/widget-includer:' => ''
    ]
    
];

?>