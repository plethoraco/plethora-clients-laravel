<?

require_once(dirname(__FILE__) . '/inc/settings.php');
require_once(dirname(__FILE__) . '/inc/actions.php');
require_once(dirname(__FILE__) . '/inc/functions.php');

?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>UP Education Signature Builder</title>
	<link rel="stylesheet" type="text/css" href="css/builder.css" />
	<script src="js/builder.js"></script>
</head>
<body>

	<h1>UP Education Signature Builder</h1>

	<div id="builder">
		<form method="post" enctype="multipart/form-data">
			<h2>Your Details</h2>
			<fieldset>
				<label for="name">Name</label>
				<input type="text" name="name" id="name" value="<?=v('name')?>" required="required">
			</fieldset>
			<fieldset>
				<label for="title">Title</label>
				<input type="text" name="title" id="title" value="<?=v('title')?>" required="required">
			</fieldset>
			<fieldset>
				<label for="phone">Mobile</label>
				<input type="text" name="phone" id="phone" value="<?=v('phone')?>" required="required">
			</fieldset>
			<fieldset>
				<label for="email">Email</label>
				<input type="email" name="email" id="email" value="<?=v('email')?>" required="required">
			</fieldset>
			<? /*
			<fieldset>
				<label for="address">Address</label>
				<textarea name="address" id="address" required="required"><?=v('address')?></textarea>
			</fieldset>
			<fieldset>
				<label>Photo</label>
				<div class="input">
					<label><input type="radio" name="imageType" value="logo" <?=(!v('imageType') || v('imageType') == 'logo') ? 'checked="checked"' : ''?>> Logo</label>
					&nbsp;
					<label><input type="radio" name="imageType" value="custom" <?=(v('imageType') == 'custom') ? 'checked="checked"' : ''?>> Custom: <input type="file" name="image"></label>
				</div>
			</fieldset>
			*/ ?>
			<fieldset>
				<label for="template">Template</label>
				<select name="template"><?
					foreach ($GLOBALS['settings']['themes'] as $id => $name) {
						?><option value="<?=$id?>" <?=(v('template') == $id) ? ' selected="selected"' : ''?>><?=$name?></option><?
					}
				?></select>
			</fieldset>
			<fieldset>
				<label>&nbsp;</label>
				<input type="submit" name="submit" value="Create">
				<input type="hidden" name="action" value="signatureSave">
			</fieldset>
		</form>
	</div>

	<? if (!empty($_POST['action']) && $_POST['action'] == 'signatureSave') { ?>

		<div id="instructions">
			<h2>Instructions</h2>
			Choose an email client to set up:
			<a href="javascript:showInstructions('instructionsOutlook');">Outlook</a> /
			<a href="javascript:showInstructions('instructionsGmail');">Gmail</a> /
			<a href="javascript:showInstructions('instructionsMacMail');">Mac Mail</a>

			<div class="instructionPanel default" id="instructionsOutlook" name="instructionsOutlook">
				<h3>Outlook 2013 / Outook 2016</h3>
				<h4>Preview</h4>
				<div class="previewContainer">
					<div id="previewContainerOutlook"><?=template(v('template'), $_POST)?></div>
				</div>
				<h4>Code</h4>
				<textarea class="code" id="codeContainerOutlook"><?=htmlspecialchars(template(v('template'), $_POST))?></textarea>
				<h4>Steps</h4>
				<ol>
					<li><a href="javascript:selectBlock('codeContainerOutlook');">Select the code above</a> then press Ctrl + C to copy it.</li>
					<li>In Outlook click <em>File</em> > <em>Options</em> > <em>Mail</em> > <em>Signatures...</em></li>
					<li>
						Create a new signature, leave it blank and name it whatever you like.<br>
						<img src="img/outlook-signature-window.png" alt="Outlook signature window" />
					</li>
					<li>Close the signature editor by clicking OK.</li>
					<li>
						Click the <em>Signatures...</em> button again but this time hold down <em>Ctrl</em> while you click. This will open up the signatures folder on your computer.<br>
						<img src="img/outlook-open-folder.png" alt="Outlook open folder" />
					</li>
					<li>
						Right-click the <em>TemplateName.htm</em> file and choose a text editor from the <em>Open With</em> list.<br>
						<img src="img/outlook-edit-menu.png" alt="Outlook edit menu" />
					</li>
					<li>Scroll down to the <em>&lt;body&gt;</em>, delete all the code between the <em>&lt;body&gt;</em> and <em>&lt;/body&gt;</em> tags.</li>
					<li>
						Paste the new Signature code between the <em>&lt;body&gt;</em> and <em>&lt;/body&gt;</em> tags with Ctrl + V.<br>
						<img src="img/outlook-body-tag.png" alt="Outlook source code body tag" />
					</li>
					<li>Save and close the file.</li>
					<li>Close the Outlook Options window.</li>
				</ol>
			</div>

			<div class="instructionPanel" id="instructionsGmail" name="instructionsGmail">
				<h3>Gmail</h3>
				<h4>Preview</h4>
				<div class="previewContainer">
					<div id="previewContainerGmail"><?=template(v('template'), $_POST)?></div>
				</div>
				<h4>Steps</h4>
				<ol>
					<li><a href="javascript:selectBlock('previewContainerGmail');">Select the signature Preview above</a> then press Ctrl + C to copy it.</li>
					<li>Open <a href="https://mail.google.com/mail/u/0/?shva=1#settings/general" target="_blank">Gmail's general settings</a>.</li>
					<li>In the Signature section click into the editor and press Ctrl + V to paste your signature.</li>
					<li>
						Check the option to "Insert this signature before quoted text in replies and remove the "--" line that precedes it."<br>
						<img src="img/gmail-signature-box.png" alt="Gmail signature box" /></li>
					<li>At the bottom of the page, click Save Changes.</li>
				</ol>
				<p><a href="https://support.google.com/mail/answer/8395?co=GENIE.Platform%3DDesktop&hl=en" target="_blank">Official documentation</a></p>
			</div>

			<div class="instructionPanel" id="instructionsMacMail" name="instructionsMacMail">
				<h3>Mac Mail</h3>
				<p>Mac Mail forces the contents single lines, so this version may look slightly different.</p>
				<h4>Preview</h4>
				<div class="previewContainer">
					<div id="previewContainerMacMail"><?=template(v('template'), $_POST, 'minimal')?></div>
				</div>
				<h4>Steps</h4>
				<ol>
					<li><a href="javascript:selectBlock('previewContainerMacMail');">Select the signature Preview above</a> then press Ctrl + C to copy it.</li>
					<li>Click the Mail menu and choose Preferences.</li>
					<li>On the Signatures tab click the <em>+</em> icon to add a new siganture.</li>
					<li>
						Click into the editor on the right and press Ctrl + V to paste your signature.<br>
						<img src="img/mac-mail-preferences.png" alt="Mac Mail .com signature field" />
					</li>
					<li>Uncheck the option to "Always match my default message font."</li>
					<li>Close the Preferences window.</li>
				</ol>
			</div>
		</div>

	<? } ?>

</body>
</html>