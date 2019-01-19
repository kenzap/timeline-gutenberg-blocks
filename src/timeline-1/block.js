/**
 * BLOCK: timeline-1
 *
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;

import { blockProps, ContainerSave } from '../commonComponents/container/container';
import Edit from './edit';

/**
 * Provides the initial data for new block
 */
export const defaultItem = {
    title: __( 'New event', 'kenzap-timeline' ),
    description: __( 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna suprecent.', 'kenzap-timeline' ),
    time: `10.00${ __( 'am' ) } - 11.00${ __( 'am' ) }`,
};

export const defaultSubBlocks = JSON.stringify( [
    {
        title: __( 'Registration', 'kenzap-timeline' ),
        description: __( 'Visit ticket counters to register or print your badge. Please download app in advance.', 'kenzap-timeline' ),
        time: `8.00${ __( 'am' ) } - 10.00${ __( 'am' ) }`,
        key: new Date().getTime() + 1,
    },
    {
        title: __( 'Introduction', 'kenzap-timeline' ),
        description: __( 'Welcome speach from conference organizers. Overview of upcomming events.', 'kenzap-timeline' ),
        time: `10.00${ __( 'am' ) } - 11.00${ __( 'am' ) }`,
        key: new Date().getTime() + 2,
    },
    {
        title: __( 'Networking', 'kenzap-timeline' ),
        description: __( 'Main conference part where all participants can network and exchange their contacts.', 'kenzap-timeline' ),
        time: `11.00${ __( 'am' ) } - 4.00${ __( 'pm' ) }`,
        key: new Date().getTime() + 3,
    },
    {
        title: __( 'Live Demo', 'kenzap-timeline' ),
        description: __( '10 exhibiting startups are presenting their prototype on the main stage.', 'kenzap-timeline' ),
        time: `4.00${ __( 'pm' ) } - 6.00${ __( 'pm' ) }`,
        key: new Date().getTime() + 4,
    },
    {
        title: __( 'Pub Crawl', 'kenzap-timeline' ),
        description: __( 'Second conference round! Enjoy live music, beer & city vibes.', 'kenzap-timeline' ),
        time: `6.00${ __( 'pm' ) } - 9.00${ __( 'pm' ) }`,
        key: new Date().getTime() + 5,
    },
] );

/**
 * Generate inline styles for custom settings of the block
 * @param {Object} attributes - of the block
 * @returns {Node} generated styles
 */
export const getStyles = attributes => {
    const kenzapContanerStyles = {
        maxWidth: `${ attributes.containerMaxWidth === '100%' ? '100%' : attributes.containerMaxWidth + 'px' }`,
        '--maxWidth': `${ attributes.containerMaxWidth === '100%' ? '100wh' : attributes.containerMaxWidth + ' ' } `,
    };

    const vars = {
        '--paddings': `${ attributes.containerPadding }`,
        '--paddingsMin': `${ attributes.containerPadding / 4 }`,
        '--paddingsMinPx': `${ attributes.containerPadding / 4 }px`,
        '--timeLineColor': attributes.timeLineColor,
    };

    return {
        vars,
        kenzapContanerStyles,
    };
};

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kenzap/timeline-1', {
    title: __( 'Kenzap timeline 1', 'kenzap-timeline' ),
    icon: 'calendar-alt',
    category: 'layout',
    keywords: [
        __( 'timeline', 'kenzap-timeline' ),
    ],
    anchor: true,
    html: true,
    attributes: {
        ...blockProps,

        titleSize: {
            type: 'number',
            default: 18,
        },

        descriptionSize: {
            type: 'number',
            default: 14,
        },

        timeSize: {
            type: 'number',
            default: 18,
        },

        textColor: {
            type: 'string',
            default: '#000',
        },

        timeLineColor: {
            type: 'string',
            default: '#ec2778',
        },

        withAnimation: {
            type: 'boolean',
            default: true,
        },

        items: {
            type: 'array',
            default: [],
        },

        isFirstLoad: {
            type: 'boolean',
            default: true,
        },

        blockUniqId: {
            type: 'number',
            default: 0,
        },
    },

    edit: ( props ) => {
        if ( props.attributes.items.length === 0 && props.attributes.isFirstLoad ) {
            props.setAttributes( {
                items: [ ...JSON.parse( defaultSubBlocks ) ],
                isFirstLoad: false,
            } );
            // TODO It is very bad solution to avoid low speed working of setAttributes function
            props.attributes.items = JSON.parse( defaultSubBlocks );
            if ( ! props.attributes.blockUniqId ) {
                props.setAttributes( {
                    blockUniqId: new Date().getTime(),
                } );
            }
        }

        return ( <Edit { ...props } /> );
    },

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     * @param {Object} props - attributes
     * @returns {Node} rendered component
     */
    save: function( props ) {
        const {
            className,
            attributes,
        } = props;

        const { vars, kenzapContanerStyles } = getStyles( props.attributes );

        const time = ( item ) => (
            <div className="kenzap-col-6">

                <div className="time">
                    <RichText.Content
                        tagName="div"
                        value={ item.time }
                        style={ {
                            color: attributes.textColor,
                            fontSize: `${ attributes.timeSize }px`,
                        } }
                    />
                </div>
            </div>
        );

        const info = ( item ) => (
            <div className="kenzap-col-6">
                <div className="info">

                    <RichText.Content
                        tagName="h3"
                        value={ item.title }
                        style={ {
                            color: attributes.textColor,
                            fontSize: `${ attributes.titleSize }px`,
                            lineHeight: `${ attributes.titleSize * 1.34 }px`,
                        } }
                    />
                    <RichText.Content
                        tagName="p"
                        value={ item.description }
                        style={ {
                            color: attributes.textColor,
                            fontSize: `${ attributes.descriptionSize }px`,
                            lineHeight: `${ attributes.descriptionSize * 1.73 }px`,
                        } }
                    />
                </div>
            </div>
        );

        return (
            <div className={ className ? className : '' } style={ vars }>
                <ContainerSave
                    className={ `kenzap-timeline-1 ${ attributes.withAnimation ? 'kp-animate' : '' } block-${ attributes.blockUniqId }` }
                    attributes={ attributes }
                    style={ vars }
                    withBackground
                    withPadding
                >
                    <div className="kenzap-container" style={ kenzapContanerStyles }>
                        <div className="timeline">
                            { attributes.items && attributes.items.map( ( item, index ) => (
                                <div
                                    key={ item.key }
                                    className="timeline-content"
                                >
                                    { ( index + 1 ) % 2 !== 0 ? (
                                        <div className="kenzap-row">
                                            { time( item ) }
                                            { info( item ) }
                                        </div>
                                    ) : (
                                        <div className="kenzap-row">
                                            { info( item ) }
                                            { time( item ) }
                                        </div>
                                    ) }
                                </div>
                            ) ) }
                        </div>
                    </div>
                </ContainerSave>
            </div>
        );
    },
} );
