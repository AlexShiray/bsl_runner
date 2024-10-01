class BSLTelegramBotTypes{
	$type;
	$name;
	$help = Object.getPrototypeOf(this).constructor.$help;

	static async $help(context){
		console.log(`Описывает используемый тип команды для устанавливаемых команд в telegram чатах.`.replace(/\n[\s]+\|/g, "\n"));

		return;
	}

	constructor(name){
		this.$type = require("./objects/type").BSLAvailableTypes.TelegramТипКоманды;
		this.$name = name;
	}

	toString(){
		return this.$name;
	}

	typeOf(){
		return this.$type;
	}
}

exports.BSLGCTelegramBot = {
	TelegramТипыКоманд:{
		Стандартно: new BSLTelegramBotTypes("default"),
		ПриватныеЧаты: new BSLTelegramBotTypes("all_private_chats"),
		ГрупповыеЧаты: new BSLTelegramBotTypes("all_group_chats"),
		АдминистраторыЧатов: new BSLTelegramBotTypes("all_chat_administrators"),
		ВыбранныйЧат: new BSLTelegramBotTypes("chat"),
		АдминистраторыВыбранногоЧата: new BSLTelegramBotTypes("chat_administrators"),
		ВыбранныйПользовательВыбранногоЧата: new BSLTelegramBotTypes("chat_member"),
		$help: function(context){
			console.log(`Описывает типы команд для устанавливаемых команд в telegram чатах.
			|	Значения:
			|	Стандартно - По стандарту, если не указано других комманд
			|	ПриватныеЧаты - Команды будут отображаться только для приватных чатов с ботом
			|	ГрупповыеЧаты - Команды будут отображаться только в групповых чатах и суперчатах
			|	АдминистраторыЧатов - Команды только для администраторов чатов
			|	ВыбранныйЧат - Команды только для определенного чата
			|	АдминистраторыВыбранногоЧата - Команды только для администраторов определенного чата
			|	ВыбранныйПользовательВыбранногоЧата - Команды только для определенного пользователя определенного чата`.replace(/\n[\s]+\|/g, "\n"));
				return;
		}
	}
}