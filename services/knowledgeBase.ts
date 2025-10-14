// This file simulates a knowledge base created from a curated list of trusted documents (e.g., PDFs).
// In a real-world, full-stack application, this content would be processed, chunked, embedded,
// and stored in a vector database for retrieval. For this client-side application, we use this
// simple object as a stand-in for that complex backend infrastructure.

export const knowledgeBase: Record<string, string> = {
    'Anxiety': `
Anxiety is the body's natural response to stress. It's a feeling of fear or apprehension about what's to come. 
Common symptoms include feelings of nervousness, restlessness, or being tense; having a sense of impending danger, panic, or doom; 
having an increased heart rate; breathing rapidly (hyperventilation); sweating; and trembling. 
While occasional anxiety is a normal part of life, people with anxiety disorders frequently have intense, excessive, and persistent worry and fear about everyday situations.
A simple grounding technique to manage a moment of anxiety is the 5-4-3-2-1 method. 
Acknowledge 5 things you can see around you, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This helps reconnect you with the present moment.
`,

    'Cognitive Distortions': `
Cognitive distortions are irrational or exaggerated thought patterns that can cause us to perceive reality inaccurately. 
These automatic thoughts are often subtle and can contribute to negative emotional states like anxiety and depression. 
Common examples include:
1.  **Black-and-White Thinking:** Seeing things in absolute, all-or-nothing terms. If a situation falls short of perfect, you see it as a total failure.
2.  **Catastrophizing:** Expecting the worst-case scenario to happen, without considering more likely and less dramatic outcomes.
3.  **Personalization:** Believing that you are responsible for events that are, in reality, outside of your control.
A helpful tip to challenge a cognitive distortion is to ask yourself: 'Is there another way to look at this situation?' or 'What evidence do I have that this thought is 100% true?'. This creates distance and allows for a more balanced perspective.
`,

    'Mindfulness': `
Mindfulness is the practice of purposely bringing one's attention to the present moment without judgment. 
It involves being fully aware of where we are and what we’re doing, rather than being overly reactive or overwhelmed by what’s going on around us. 
Mindfulness doesn't eliminate stress or difficult feelings, but it can help us respond to them in a calmer manner. 
Common feelings associated with a lack of mindfulness include feeling scattered, overwhelmed, or like you're on 'autopilot'.
A simple way to practice mindfulness is through 'mindful breathing'. 
Take a moment to focus on your breath. Notice the sensation of the air entering your nostrils, filling your lungs, and then leaving your body. 
When your mind wanders, gently guide it back to your breath. Try this for just one minute.
`,

    'Self-Compassion': `
Self-compassion involves treating yourself with the same kindness, concern, and support you’d show to a good friend. 
It means accepting that to be human is to be imperfect. 
It has three main components: 
1.  **Self-Kindness:** Being warm and understanding toward ourselves when we suffer, fail, or feel inadequate, rather than ignoring our pain or flagellating ourselves with self-criticism.
2.  **Common Humanity:** Recognizing that suffering and personal inadequacy are part of the shared human experience – something that we all go through rather than being something that happens to "me" alone.
3.  **Mindfulness:** Taking a balanced approach to our negative emotions so that feelings are neither suppressed nor exaggerated.
A simple tip is to ask yourself, 'What would I say to a friend who was going through this?'. Then, try to direct those same words of kindness and support inward.
`,

    'Burnout': `
Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress. 
It occurs when you feel overwhelmed, emotionally drained, and unable to meet constant demands. 
Key signs include:
1.  **Exhaustion:** Feeling drained and depleted, lacking the energy to face the day.
2.  **Cynicism and Detachment:** Feeling negative about your job or life, and distancing yourself from your work and colleagues.
3.  **Reduced Efficacy:** A sense of ineffectiveness and lack of accomplishment. You may feel that your contributions no longer make a difference.
A crucial step in managing burnout is to prioritize rest and recovery. 
Schedule short breaks throughout your day, ensure you are getting adequate sleep, and consciously disconnect from work-related tasks and communications during your off-hours.
`,

    'Imposter Syndrome': `
Imposter syndrome is an internal psychological experience of feeling like a phony in some area of your life, despite any success you’ve achieved. 
People experiencing it often feel like they don't deserve their accomplishments and live in fear of being exposed as a 'fraud'. 
Common feelings include self-doubt, anxiety, and a sense that you've deceived others into thinking you're more intelligent or competent than you believe yourself to be. 
It often co-occurs with perfectionism.
An actionable tip to combat imposter syndrome is to keep an 'accomplishments list'. 
Write down your successes, big and small. When feelings of doubt creep in, review this list to remind yourself of tangible evidence of your competence and hard work.
`,

    'Setting Boundaries': `
Boundaries are the limits and rules we set for ourselves within relationships. 
Healthy boundaries are essential for self-esteem and maintaining healthy relationships. 
Not having boundaries can lead to resentment, anger, and burnout. 
Setting a boundary can feel difficult or uncomfortable because you might fear disappointing others. 
Examples include saying 'no' to requests that drain your energy, limiting contact with people who are not respectful of your feelings, and protecting your personal time.
A simple way to start is by using 'I' statements. 
For example, instead of saying 'You're asking too much of me,' you could say, 'I feel overwhelmed with my current workload and don't have the capacity to take on that task right now.' This communicates your needs without placing blame.
`,

    'The Inner Critic': `
The inner critic is that voice inside your head that judges, demeans, and doubts you. 
It often sounds like a critical parent or authority figure. This voice can undermine your confidence and contribute to feelings of low self-worth, anxiety, and sadness. 
The inner critic often uses harsh language, points out your flaws, and compares you unfavorably to others. 
It might say things like 'You're not good enough' or 'You're going to fail.'
A helpful technique to manage the inner critic is to name it and separate it from your own voice. 
When you hear critical thoughts, you can say to yourself, 'My inner critic is being loud today.' 
This act of noticing and labeling the voice creates a separation, reminding you that its judgments are thoughts, not facts.
`
};
