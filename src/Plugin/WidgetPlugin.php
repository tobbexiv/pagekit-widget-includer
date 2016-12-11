<?php

namespace Tobbe\WidgetIncluder\Plugin;

use Pagekit\Application as App;
use Pagekit\Content\Event\ContentEvent;
use Pagekit\Event\EventSubscriberInterface;

class WidgetPlugin implements EventSubscriberInterface
{

    /**
     * Content plugins callback.
     *
     * @param ContentEvent $event            
     */
    public function onContentPlugins(ContentEvent $event)
    {
        $event->addPlugin('widget', [
            $this,
            'applyPlugin'
        ]);
    }

    /**
     * Defines the plugins callback.
     *
     * @param array $options            
     * @return string|null
     */
    public function applyPlugin(array $options)
    {
        if (! isset($options['id'])) {
            return '';
        }
        
        $widget = App::module('tobbe/widget-includer');
        $app = App::getInstance();
        $widget_id = $options['id'];
        unset($options['id']);
        
        return $widget->renderWidget($app, $widget_id, $options)['content'];
    }

    /**
     *
     * {@inheritdoc}
     *
     */
    public function subscribe()
    {
        return [
            'content.plugins' => [
                'onContentPlugins',
                25
            ]
        ];
    }
}