<?php
namespace Tobbe\WidgetIncluder;

use Pagekit\Application as App;
use Tobbe\WidgetIncluder\Plugin\WidgetPlugin;
use Pagekit\Module\Module;
use Pagekit\Widget\Model\Widget;

class WidgetIncluderModule extends Module
{

    /**
     *
     * {@inheritdoc}
     *
     */
    public function main(App $app)
    {
        $app->subscribe(new WidgetPlugin());
    }

    public function renderWidget(App $app, $widget_id, $options = [], $view = null)
    {
        $user = $app->user();
        
        /** @var Widget $widget */
        if (!$widget = Widget::where([
            'id' => $widget_id
        ])->first()) {
            throw new App\Exception('Widget not found', 404);
        }
        
        if (!$widget->hasAccess(App::user())
                or !$type = App::widget($widget->type)
                or $widget->status !== 1) {
            return '';
        }
        
        $hideTitle = false;
        $titleSize = '4';
        $title     = $widget->title;
        
        $content = '';
        
        foreach ($options as $key => $value) {
            switch ($key) {
                case 'hideTitle':
                    $hideTitle = ($value == 1);
                  break;
                
                case 'titleSize':
                    $titleSize = $value;
                  break;
                
                case 'title':
                    $title = $value;
                  break;
            };
        }
        
        if($hideTitle == false) {
            $content .= '<h' . $titleSize . '>' . $title . '</h' . $titleSize . '>';
        }
        
        /*
         * Markdown should be already replaced. But line breaks from e.g. menu 
         * break the display as soon as there is a title. So we remove them.
         */
        $content .= preg_replace('/\n/i', '', $type->render($widget));
        
        return $content;
    }
}