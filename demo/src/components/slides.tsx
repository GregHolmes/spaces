import { Paragraph } from './Paragraph';
import { Title } from './Title';
import { Image } from './Image';

export const slides = [
  {
    children: (
      <div className="grid grid-cols-1 md:grid-cols-[390px_1fr] gap-8 h-full items-center p-8">
        <div>
          <Title
            id="1"
            slide="0"
            className="md:mb-24"
          >
            Key Design Principles
          </Title>
          <Paragraph
            id="2"
            slide="0"
          >
            Effective design centres on four basic principles: contrast, repetition, alignment and proximity. These
            appear in every design.
          </Paragraph>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Image
            src="/contrast.svg"
            id="3"
            slide="0"
          >
            <div className="absolute w-[176px] left-[20px] top-[86px] md:top-20 md:left-6 md:right-6 md:mx-auto">
              <Title
                variant="h2"
                id="4"
                slide="0"
              >
                Contrast
              </Title>
              <Paragraph
                variant="aside"
                id="5"
                slide="0"
              >
                When a design uses several elements, the goal is to make each one distinct.
              </Paragraph>
            </div>
          </Image>
          <Image
            src="/repetition.svg"
            id="6"
            slide="0"
          >
            <div className="absolute w-[176px] left-[20px] top-[86px] md:top-20 md:left-6 md:right-6 md:mx-auto">
              <Title
                variant="h2"
                id="7"
                slide="0"
              >
                Repetition
              </Title>
              <Paragraph
                variant="aside"
                id="8"
                slide="0"
              >
                Repetition helps designers establish relationships, develop organization and strengthen unity.
              </Paragraph>
            </div>
          </Image>
          <Image
            src="/alignment.svg"
            id="9"
            slide="0"
          >
            <div
              data-id="slide-figcaption-placeholder"
              className="absolute w-[176px] left-[20px] top-[86px] md:top-20 md:left-6 md:right-6 md:mx-auto"
            >
              <Title
                variant="h2"
                id="10"
                slide="0"
              >
                Alignment
              </Title>
              <Paragraph
                variant="aside"
                id="11"
                slide="0"
              >
                Alignment creates a clean, sophisticated look. All elements should relate to all others in some way.
              </Paragraph>
            </div>
          </Image>
          <Image
            src="/proximity.svg"
            id="12"
            slide="0"
          >
            <div
              data-id="slide-figcaption-placeholder"
              className="absolute w-[176px] left-[20px] top-[86px] md:top-20 md:left-6 md:right-6 md:mx-auto"
            >
              <Title
                variant="h2"
                id="13"
                slide="0"
              >
                Proximity
              </Title>
              <Paragraph
                variant="aside"
                id="14"
                slide="0"
              >
                When items are grouped, they become a single visual unit, rather than several separate entities.
              </Paragraph>
            </div>
          </Image>
        </div>
      </div>
    ),
  },
  {
    children: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center p-8 relative">
        <div>
          <Title
            variant="h3"
            id="1"
            slide="1"
          >
            How users read
          </Title>
          <Title
            variant="h1"
            className="md:mb-12"
            id="2"
            slide="1"
          >
            Add graphics
          </Title>
          <Paragraph
            className="!mb-8"
            id="3"
            slide="1"
          >
            No one likes boring text blocks on a website. And{' '}
            <span className="text-ably-avatar-stack-demo-slide-title-highlight font-semibold">images and icons</span>{' '}
            are the fastest way to get information.
          </Paragraph>
          <Paragraph
            id="4"
            slide="1"
          >
            But <span className="text-ably-avatar-stack-demo-slide-title-highlight font-semibold">don't overdo it</span>
            . If you can't explain for what purpose you put this line or icon, it's better to abandon it.
          </Paragraph>
        </div>
        <Image
          src="/collaborative-document.svg"
          className="absolute w-72 -right-1 md:-right-4 md:w-[477px]"
          id="5"
          slide="1"
        />
      </div>
    ),
  },
  {
    children: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center p-8">
        <div>
          <Title
            variant="h1"
            className="md:mb-12"
            id="1"
            slide="2"
          >
            Design Statistics
          </Title>
          <Paragraph
            className="md:!mb-[350px]"
            id="2"
            slide="2"
          >
            How do SMBs rate the importance of graphic design to their success?
          </Paragraph>
        </div>
        <Image
          src="/bubble-diagram.svg"
          className="absolute md:w-[688px] md:right-60 md:top-20"
          id="3"
          slide="2"
        />
      </div>
    ),
  },
];
