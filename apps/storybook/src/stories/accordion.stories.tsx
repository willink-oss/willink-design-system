import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@willink-labs/react";
import { Minus, Plus } from "lucide-react";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  args: {
    type: "single",
    collapsible: true,
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const faqItems = [
  {
    value: "item-1",
    question: "送料はいくらですか?",
    answer: "5,000円以上のご注文で送料無料になります。それ未満は全国一律500円です。",
  },
  {
    value: "item-2",
    question: "返品はできますか?",
    answer: "商品到着後14日以内であれば、未開封に限り返品を承ります。",
  },
  {
    value: "item-3",
    question: "支払い方法は何がありますか?",
    answer: "クレジットカード・銀行振込・コンビニ決済をご利用いただけます。",
  },
];

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const CardVariant: Story = {
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value} variant="card">
          <AccordionTrigger className="px-5">{item.question}</AccordionTrigger>
          <AccordionContent className="px-5">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const BorderedVariant: Story = {
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value} variant="bordered">
          <AccordionTrigger className="px-4">{item.question}</AccordionTrigger>
          <AccordionContent className="px-4">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const CustomIcon: Story = {
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger
            icon={
              <>
                <Plus
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-muted group-data-[state=open]/trigger:hidden"
                />
                <Minus
                  aria-hidden="true"
                  className="hidden h-4 w-4 shrink-0 text-muted group-data-[state=open]/trigger:block"
                />
              </>
            }
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
