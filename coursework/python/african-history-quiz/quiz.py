#Imports the random module 
import random as r

#A dictionary titled quiz_questions that is separted into 3 categories namely notable figures, culture, and history.
#Each catagory is broken down into 6-7 questions that have an options key which has a list of four options of possible answers for the question 
#and also a key that stores the correct answer
quiz_questions = { "notable_figures": [
        {"question": "Who was the first black president of South Africa ?", #Question 1
         "options": ["Jacob Zuma", "Thabo Mbeki", "Nelson Mandela", "Cyril Ramaphosa"], 
         "correct_answer": "Nelson Mandela"},
        {"question": "Who was the first African person to obtain a Nobel Peace Prize ?", #Question 2 
         "options": ["Albert Luthuli", "Desmond Tutu", "Nelson Mandela", "Anwar Sadat"],
         "correct_answer": "Albert Luthuli"},
        {"question": "Which Zulu king was renowned for his impressive military tactics?", #Question 3
         "options": ["Shaka Zulu", "Shala Zulu", "Ntombela kaNkosinkulu", "Gumede kaZulu"],
         "correct_answer": "Shaka Zulu"},
        {"question": "What was the name of the prison where Nelson Mandela was kept during his sentence?", #Question 4
         "options": ["Robben Island", "Pollsmoor Prison", "Johannesburg Prison", "Victor Verster Prison"],
         "correct_answer": "Robben Island"},
        {"question": "Name the Ethiopian emperor who is well known for modernizing the country in the early 20th century?", #Question 5
         "options": ["Menelik II", "Haile Selassie I", "Iyasu V", "Tewodros II"],
         "correct_answer": "Haile Selassie I"},
        {"question": "Who was the first elected african female head of state. (She was the 24th president of Libera)?", #Question 6
         "options": ["Ellen Johnson Sirleaf", "Wangari Maathai", "Joyce Banda", "Leymah Gbowee"],
         "correct_answer": "Ellen Johnson Sirleaf"},
        {"question": "Who was the Libyan leader known for his green book?", #Question 7
         "options": ["Muammar Gaddafi", "Omar al-Mukhtar", "Anwar Sadat", "Hosni Mubarak"],
         "correct_answer": "Muammar Gaddafi"},],
    "culture": [
        {"question": "What is the name of the African instrument that is also refered to as a thumb piano", #Question 8
         "options": ["Mbira", "Kora", "Djembe", "Balafon"],
         "correct_answer": "Mbira"},
        {"question": "In which African country can one find well-known rock-hewn churches ?", #Question 9
         "options": ["Ethiopia", "Egypt", "Sudan", "Kenya"],
         "correct_answer": "Ethiopia"},
        {"question": "What is the ancient Egyptian writing system with symbols/pictures called?", #Question 10
         "options": ["Hieroglyphics", "Cuneiform", "Hanzi", "Runes"],
         "correct_answer": "Hieroglyphics"},
        {"question": "Which West African country is famous for producing Kente cloth traditionally?", #Question 11
         "options": ["Ghana", "Nigeria", "Ivory Coast", "Togo"],
         "correct_answer": "Ghana"},
        {"question": "What is the masquerade festival celebrated by the Yoruba people in Nigeria called ?", #Question 12
         "options": ["Egungun Festival", "Eyo Festival", "Carnival", "Osun-Osogbo Festival"],
         "correct_answer": "Egungun Festival"},
        {"question": "Which African country do the Himba people reside in?", #Question 13
         "options": ["Kenya", "Tanzania", "Namibia", "Rwanda"],
         "correct_answer": "Namibia"},
        {"question": "What is the name of the african art form that involves weaving strips of dried palm leaves?", #Question 14
         "options": ["Basket weaving", "Pottery", "Wood carving", "Textile weaving"],
         "correct_answer": "Basket weaving"},],
    "history": [
        {"question": "What was the name of the ancient African city that was a major center of learning in the Mali Empire?", #Question 15
         "options": ["Timbuktu", "Gao", "Djenné", "Kano"],
         "correct_answer": "Timbuktu"},
        {"question": "Which african city had conflict and fought the Roman empire in the Punic wars?", #Question 16
         "options": ["Carthage", "Alexandria", "Tripoli", "Tangier"],
         "correct_answer": "Carthage"},
        {"question": "What is the name of the kingdom in Nigeria that was known for it's advanced bronze sculpture?", #Question 17
         "options": ["Kingdom of Benin", "Ashanti Kingdom", "Yoruba Kingdom", "Songhai Empire"],
         "correct_answer": "Kingdom of Benin"},
        {"question": "What significant event took place in Sharpeville in South Africa on the 21 March 1960? ", #Question 18
         "options": ["The Sharpeville Massacre", "Soweto Uprising", "The Sharpville Trial", "Trevor Manual Massacre"],
         "correct_answer": "The Sharpeville Massacre"},
        {"question": "What historic event took place in the Congo on 30  June 1960?", #Question 19
         "options": ["Declaration of Independence", "The Lusaka Peace Agreement", "Begining of the Congo Crisis", "Founding of the Congo Free state"],
         "correct_answer": "Declaration of Independence"},
        {"question": "What was the name of the impressive rock structure that was built during the reign of Pharaoh Khufu?", #Question 20
         "options": ["Great Pyramid of Giza", "Stone henge", "Sphinx", "Pyramid of Djoser"],
         "correct_answer": "Great Pyramid of Giza"},]}

#A function that shuffles the index of the options and returns them as a new list (shuffled)
def Shuffle(options):
    shuffled = options[:]
    r.shuffle(shuffled)
    return shuffled

#Function selects a randomized question that has not been selected from one of the three categories.
#The options are then suffled using the above user defined function Shuffle before the question is returned.
def generate_question(category,prev_questions):
    available_questions = [ques for ques in quiz_questions[category] if ques["question"] not in prev_questions]
    if not available_questions:
        return None  
    question = r.choice(available_questions)
    question["options"] = Shuffle(question["options"])
    return question

#Function that checks whether or not the players inputed answer is the same or different to the correct answer.
def validate_answer(question,player_answer):
    return question["correct_answer"] == player_answer

#Function that increases the score by 1 unit if the players answer is correct.
def update_score(score,correct):
    if correct:
        score += 1
    return score

#Function that prints the selected question and options from 1-4.
#The function asks the user to enter their answer via entering the corresponding number of the answer they would like to select.
#If the users input is 1-4 it returns the selected answer. If not it will display Invalid choice(Enter a number from 1-4):.
def get_player_answer(question):
    print(question["question"])
    for i,opt in enumerate(question["options"],start=1):
        print(f"{i}.{opt}")
    while True:
        ans = input("Choose the answer(enter the corresponding number):")
        if ans.isdigit():
            ans_list = int(ans) - 1
            if 0 <= ans_list < len(question["options"]):
                return question["options"][ans_list]
        print("Invalid choice(Enter a number from 1-4):")

#Function that runs the quiz for 10 levels(the amount of levels can be changed via total_levels)
def play_quiz(total_levels):
    score = 0
    level = 1
    prev_questions = set()
    while level <= total_levels:
        print(f"\n<---LEVEL {level}--->")
#Selects a category for the current level
        category = list(quiz_questions.keys())[level % len(quiz_questions)]
#Generates the question based on the category selected
        question = generate_question(category,prev_questions)
#Stores the selected question in the set of questions that were already displayed to the user 
        if question is None:
            print("No more questions available in this category.")
            break
        prev_questions.add(question["question"])
        player_answer = get_player_answer(question)
        if player_answer is not None:
#Validates the players answer using the validate_answer function 
#Using the update_score function updates the score based on whether the answer was correct or not.
            correct = validate_answer(question,player_answer)
            score = update_score(score, correct)
#Prints feedback to the user on whether or not their selected answer was right or wrong.
            if correct:
                print("CORRECT!")
            else:
                print(f"INCORRECT. Answer was:{question['correct_answer']}")                
        level += 1
#Indicates that the quiz has been completed and displays the final score to the user 
    print(f"\n|---FINISHED---|")
    print(f"FINAL SCORE - ({score}/{total_levels}).")

#Specified number of levels(10)
total_levels = 10
#Function that runs quiz for 10 levels
if __name__ == "__main__":
    play_quiz(total_levels)


