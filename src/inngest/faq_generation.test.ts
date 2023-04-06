import { test } from "vitest"
import { FAQJSON, GenerateFAQ } from "../openai/index.js"
import { faqJSONToSchema } from "../structued_data/schema.js";

test("test generate faq schema", async () => {
  console.log("generating faqs json from openai...")
  const res = await GenerateFAQ(process.env.OPENAI_TOKEN as string, "Tangia",
  `The Future of Twitch Streaming: How AI Will Revolutionize the Industry
  Artificial Intelligence (AI) has become increasingly important  in recent years, with applications spanning a wide range of industries: healthcare, finance, transportation, and more. “AI” is a broad term for a large interconnected group of technologies, including machine learning, natural language processing, and computer vision. These technologies have enabled machines to learn from data, make predictions, and even mimic human-like behaviors. And the transformative power of AI has begun to make its mark on Twitch and the streaming industry as well.
  AI Is Bringing Transformational Changes to Livestreaming
  Twitch streaming has evolved into a significant entertainment and revenue-generating platform for content creators and advertisers alike. And as the platform continues to grow, the need for advanced tools that enhance user experiences and streamline content creation and monetization is growing as well.
  AI has the potential to revolutionize the streaming industry with innovative solutions to the challenges faced by creators, advertisers, and platforms. From content creation and viewer engagement to advertising and analytics, AI is already having a significant  impact on many aspects of the streaming ecosystem. It will inevitably continue to disrupt traditional content creation methods and redefine the way viewers consume and interact with streaming content.
  Understanding the implications of AI integration in the streaming industry is vital for everyone involved in it. For creators, leveraging AI-powered tools can lead to more-engaging and better-personalized content, while simultaneously simplifying content creation. Advertisers can use AI-driven insights and targeting to maximize the effectiveness of their ad campaigns. And platforms like Twitch must adapt to these changes by integrating AI responsibly, addressing ethical concerns, and ensuring that user privacy and security remain a top priority.
  Generative AI and Content Creation
  Generative AI has made significant strides in recent years, with models like GPT getting a lot of attention in the world of AI-driven content creation. GPT, or Generative Pre-trained Transformer, is a type of generative AI that uses deep learning techniques to generate human-like text. By training on massive amounts of data, GPT models can generate coherent and contextually relevant text, paving the way for innovative applications in various industries, including streaming.
  Customizing AI-generated content for streaming can result in unique and engaging experiences for viewers. Twitch streamers can harness the power of generative AI to create tailored content, such as personalized stories, game scenarios, or even entire worlds. This level of customization allows creators to distinguish themselves and cater to a specific audience's preferences, resulting in more engaging and immersive streaming experiences.
  AI-powered chatbots can also enhance viewer interactions on Twitch. With natural language-processing capabilities, these chatbots can understand and respond to viewer comments in real time, fostering a sense of connection between the streamer and their audience. This improved interaction not only increases viewer satisfaction but also has the potential to boost viewer retention and grow a streamer's following.
  Content discovery and recommendations play a critical role in the success of Twitch streamers. AI algorithms can analyze viewer preferences, behaviors, and other data to provide personalized content suggestions. By surfacing relevant and engaging content to viewers, these algorithms can help streamers grow their audience and drive increased viewer engagement.
  Several successful Twitch streamers have already begun leveraging AI to elevate their content and captivate their viewers. For example, some creators have used AI-generated storylines to enhance the narrative of their gaming streams, while others have integrated AI-powered chatbots to create dynamic and interactive conversations with viewers. As more streamers adopt these AI-driven tools and techniques, the streaming landscape will continue to evolve, and new standards for content creation and viewer engagement will be set.
  AI Tools for Streamers
  The integration of AI into the streaming ecosystem offers a wealth of powerful tools for content creators; these tools can streamline various aspects of their work and enhance viewer experiences. One such tool is automated editing and highlights generation, which can significantly reduce the time and effort required for post-stream editing. By analyzing viewer engagement metrics and identifying key moments in a stream, AI can create highlight reels or condensed versions of lengthy broadcasts, making the content more accessible and shareable.
  Real-time language translation and transcription services are another invaluable AI tool for streamers. By providing instant translations of spoken content or transcribing speech into text, AI can help streamers reach a broader audience, as well as foster a more inclusive environment where language barriers are minimized.
  AI-driven performance analytics can provide insights into areas where streamers can improve their content. By analyzing viewer behavior, engagement metrics, and other relevant data, AI can offer tailored suggestions for content adjustments or identify trends in viewer preferences. Armed with this information, streamers can refine their approach to better resonate with their audience and foster growth.
  Stream moderation and community management are critical aspects of maintaining a positive and welcoming environment for viewers. AI-powered moderation tools can help by filtering out harmful or offensive content, issuing warnings, or even banning users who violate community guidelines. Automating these tasks allows streamers to focus on their content and viewer engagement, knowing that their community is well-managed.
  The potential of AI-generated avatars and virtual influencers is another exciting frontier for streaming. AI-driven virtual characters can interact with viewers in real time, offering an entirely new form of content and entertainment. As these avatars become more realistic and sophisticated, they could potentially become influential figures in the streaming world, providing unique experiences that blend the line between reality and the digital realm.
  The Impact on Advertisers and Brand Partnerships
   
  AI-generated advertising is a new avenue for personalized campaigns. Because it can generate contextually relevant and engaging ad content, AI can help advertisers tailor their campaigns to specific audience segments or individual viewer preferences. This personalization can result in higher viewer engagement and conversion rates, ultimately boosting campaign performance.
  Real-time ad placement and optimization is another area where AI can make a significant impact. By analyzing viewer engagement and other relevant data in real-time, AI can determine the optimal moments to display ads during a stream. This ensures that ads are shown when viewers are most receptive, maximizing the ads’ effectiveness and minimizing viewer disruption.
  Measuring ad performance and user engagement is essential for advertisers and brand partners in understanding the success of their campaigns. AI analytics can provide valuable insights into how viewers interact with ads, enabling advertisers to refine their strategies and make data-driven decisions. This in-depth analysis can also help brands identify high-performing streamers and forge stronger partnerships.
  However, the integration of AI into advertising also raises ethical considerations and concerns about transparency. Advertisers must ensure that AI-generated content is clearly labeled as such, and viewers should be made aware of any AI-driven targeting or ad personalization. Additionally, data privacy and security must be maintained to protect viewer information and maintain trust in the advertising ecosystem.
  By embracing AI responsibly and addressing ethical concerns, advertisers can unlock the full potential of AI-driven advertising to create more effective, personalized, and engaging campaigns that resonate with their target audiences.
  The Role of Platforms in Embracing AI
  As AI continues to make inroads into the streaming industry, platforms like Twitch play a crucial role in integrating these technologies to enhance user experiences and drive innovation. Twitch's strategy for AI integration involves incorporating advanced algorithms and tools to improve content discovery, personalization, and viewer engagement. By leveraging AI's capabilities, Twitch aims to maintain its position as a leading streaming platform and foster a vibrant creator ecosystem.
  Competing platforms are also taking note of the potential of AI and implementing their own initiatives. Platforms like YouTube Gaming, Facebook Gaming, and Mixer have been exploring AI-driven features and tools to enhance user experiences and differentiate themselves in the increasingly competitive streaming market. These initiatives range from AI-powered content recommendations and chatbots to advanced analytics and ad targeting.
  Collaborations between AI companies and streaming platforms can drive innovation in the industry, leading to the development of new tools and features that benefit content creators, advertisers, and viewers alike. By partnering with AI companies, streaming platforms can access cutting-edge technologies and expertise, accelerating their AI integration and staying ahead of the competition.
  However, it’s essential for platforms to balance their pursuit of innovation with protecting user privacy and security. AI-driven features and tools often rely on analyzing user data, so platforms must ensure that they maintain strict data protection measures and comply with relevant privacy regulations. This will ensure that they maintain user trust.Another critical aspect of AI integration in streaming platforms is addressing the ethical concern of potential biases in AI deployment. Algorithmic biases can lead to unfair treatment of certain user groups or content, undermining the platform's credibility and user experience. Platforms must work closely with AI developers to identify and mitigate any potential biases in their algorithms, ensuring fairness and transparency in AI-driven features and tools.`)
  console.log("got response from openai:", res)
  const faqJSON: FAQJSON[] = JSON.parse(res)
  const finalFAQ = faqJSONToSchema(faqJSON)
  console.log("final faq schema:", JSON.stringify(finalFAQ, null, 2))
})
