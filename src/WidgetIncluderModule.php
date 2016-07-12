<?php
namespace Tobbe\WidgetIncluder;

use Pagekit\Application as App;
use Pagekit\Module\Module;
use Pagekit\Widget\Model\Widget;
use Tobbe\WidgetIncluder\Plugin\WidgetPlugin;

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

        // get user context
        $user = $app->user();

        /** @var Widget $widget */
        if (!$widget = Widget::where([
            'id' => $widget_id,
        ])->first()) {
            throw new App\Exception('Widget not found', 404);
        }

        // widget type
        $type = App::widget($widget->type);

        // check permissions
        if ($widget->hasAccess($user) !== true
            || $type === false
            || $widget->status !== 1) {

            return '';

        }

        // default configuration
        $hideTitle = false;
        $titleSize = '4';
        $title     = $widget->title;

        $content = '';

        // overwrite with options
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

        // create title tag
        if ($hideTitle == false) {
            $content .= '<h' . $titleSize . '>' . $title . '</h' . $titleSize . '>';
        }

        /*
         * Markdown should be already replaced. But line breaks from e.g. menu
         * break the display as soon as there is a title. So we remove them.
         */
        $content .= preg_replace('/\n/', '', $type->render($widget));

        return $content;
    }
}
