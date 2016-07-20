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
    ],
    
    'events' => [
        'view.scripts' => function ($event, $scripts) {
//             if ($app['user']->hasAccess('')) {
                $scripts->register('editor-widget', 'tobbe/widget-includer:app/bundle/editor-widget.js', ['~editor']);
//             }
            
        }
    ]
    
];

?>